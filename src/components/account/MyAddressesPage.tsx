import React, { useState, useEffect, useRef } from 'react';
import {
  Plus, Edit2, Trash2, MapPin, AlertTriangle,
  CheckCircle2, Loader2, X, Lock, Pencil, Navigation
} from 'lucide-react';
import * as authService from '../../api/services/authService';
import apiClient from '../../api/client/apiClient';
import type { UserAddress, CreateAddressRequest } from '../../api/types/auth.types';

// ─────────────────────────────────────────────────────────────────────────────
// Pincode resolution — calls our own backend endpoint
// ─────────────────────────────────────────────────────────────────────────────

interface PincodeResolveResult {
  pincode:     string;
  city:         string;
  state:       string;
  district:    string;
  zone:        string | null;
  serviceable: boolean;
  source:      'flipcash_db' | 'india_post';
}

async function resolveFromBackend(pincode: string): Promise<PincodeResolveResult | null> {
  try {
    const { data } = await apiClient.get(`/accounts/pincode-resolve/?q=${pincode}`);
    return data as PincodeResolveResult;
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Status badge below pincode field
// ─────────────────────────────────────────────────────────────────────────────

type AvailStatus = 'idle' | 'checking' | 'available' | 'unavailable' | 'invalid';

const StatusBadge: React.FC<{ status: AvailStatus; city?: string }> = ({ status, city }) => {
  if (status === 'idle') return null;

  if (status === 'checking')
    return (
      <p className="flex items-center gap-1.5 text-xs text-gray-400 mt-1.5">
        <Loader2 size={11} className="animate-spin" /> Looking up pincode…
      </p>
    );

  if (status === 'available')
    return (
      <p className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold mt-1.5">
        <CheckCircle2 size={12} /> Service available in {city}
      </p>
    );

  if (status === 'invalid')
    return (
      <p className="flex items-center gap-1.5 text-xs text-red-500 font-semibold mt-1.5">
        <AlertTriangle size={12} /> Invalid pincode — please check again
      </p>
    );

  return (
    <div className="flex items-start gap-2 mt-1.5 p-2.5 bg-amber-50 border border-amber-200 rounded-lg">
      <AlertTriangle size={13} className="text-amber-500 flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-xs font-bold text-amber-800">Not serviceable yet</p>
        <p className="text-xs text-amber-600 mt-0.5">
          We don't serve this area yet. You can save the address but can't schedule pickups here.
        </p>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Auto-filled field with lock + override pencil
// ─────────────────────────────────────────────────────────────────────────────

const AutoField: React.FC<{
  value:       string;
  autoFilled:  boolean;
  required?:   boolean;
  placeholder: string;
  onChange:    (v: string) => void;
  onOverride:  () => void;
}> = ({ value, autoFilled, required, placeholder, onChange, onOverride }) => (
  <div className="relative">
    {autoFilled && (
      <span className="absolute -top-2.5 left-3 bg-white px-1 flex items-center gap-1 text-[10px] font-bold text-teal-600 z-10">
        <Lock size={8} /> Auto-filled
      </span>
    )}
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      required={required}
      readOnly={autoFilled}
      onChange={e => onChange(e.target.value)}
      className={`w-full px-4 py-3 border-2 rounded-xl text-sm focus:outline-none transition-colors ${
        autoFilled
          ? 'border-teal-300 bg-teal-50/60 text-teal-900 pr-10 cursor-default'
          : 'border-gray-200 focus:border-teal-500 bg-white'
      }`}
    />
    {autoFilled && (
      <button type="button" onClick={onOverride} title="Edit manually"
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-teal-400 hover:text-teal-700 rounded transition-colors">
        <Pencil size={13} />
      </button>
    )}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────────────────────

interface FormState extends CreateAddressRequest {
  city: string; state: string;
}

const EMPTY: FormState = {
  type: 'home', line1: '', line2: '',
  postal_code: '', city: '', state: '', is_default: false,
};


interface MyAddressesPageProps {
  username?: string;
  onLogout?: () => void;
  onNavClick?: (tab: any) => void;
  onBreadcrumbClick?: (path: string) => void;
}


const MyAddressesPage: React.FC<MyAddressesPageProps> = () => {
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [locating,  setLocating]  = useState(false); 
  const [showForm,  setShowForm]  = useState(false);
  const [editId,    setEditId]    = useState<string | null>(null);
  const [form,      setForm]      = useState<FormState>(EMPTY);

  const [status,    setStatus]    = useState<AvailStatus>('idle');
  const [availCity, setAvailCity] = useState('');
  const [cityAuto,  setCityAuto]  = useState(false);
  const [stateAuto, setStateAuto] = useState(false);

  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try { setLoading(true); setAddresses(await authService.getAddresses()); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  // ── Auto-Detect Location ──────────────────────────────────────────

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
            { headers: { 'Accept-Language': 'en' } }
          );
          
          if (!response.ok) throw new Error('Failed to fetch address');
          const data = await response.json();
          const addr = data.address;

          // 1. Extract Pincode/City/State
          const detectedPincode = addr.postcode || '';
          const detectedCity = addr.city || addr.town || addr.village || '';
          const detectedState = addr.state || '';
          
          // 2. Extract House / Building (Line 1)
          // We look for a house number or building name first.
          const houseInfo = [addr.house_number, addr.building, addr.road].filter(Boolean).join(", ");
          
          // 3. Extract Nearby / Area (Line 2)
          // We look for suburb, neighbourhood, or specific landmarks (amenity).
          const areaInfo = [addr.suburb, addr.neighbourhood, addr.amenity].filter(Boolean).join(", ");

          setForm(prev => ({
            ...prev,
            line1: houseInfo || prev.line1,
            line2: areaInfo || prev.line2,
            postal_code: detectedPincode,
            city: detectedCity,
            state: detectedState,
          }));

          if (detectedCity) setCityAuto(true);
          if (detectedState) setStateAuto(true);

          // If a valid pincode was found, trigger the serviceability check
          if (detectedPincode.length >= 6) {
            handlePincodeChange(detectedPincode);
          }

        } catch (error) {
          console.error(error);
          alert('Could not resolve your address automatically.');
        } finally {
          setLocating(false);
        }
      },
      (_error) => {
        setLocating(false);
        alert('Permission denied or location unavailable.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // ── Pincode change ───────────────────────────────────────────────

  const handlePincodeChange = (raw: string) => {
    const val = raw.replace(/\D/g, '').slice(0, 6);
    setForm(p => ({ ...p, postal_code: val }));
    if (debounce.current) clearTimeout(debounce.current);

    if (val.length < 6) {
      setStatus('idle');
      if (val.length === 0) {
        if (cityAuto)  setForm(p => ({ ...p, city:  '' }));
        if (stateAuto) setForm(p => ({ ...p, state: '' }));
        setCityAuto(false); setStateAuto(false); setAvailCity('');
      }
      return;
    }

    setStatus('checking');
    debounce.current = setTimeout(async () => {
      const result = await resolveFromBackend(val);
      if (!result) {
        setStatus('invalid');
        return;
      }
      setForm(prev => ({
        ...prev,
        city:  (!prev.city  || cityAuto)  ? result.city  : prev.city,
        state: (!prev.state || stateAuto) ? result.state : prev.state,
      }));
      setCityAuto(true); setStateAuto(true);
      setAvailCity(result.city);
      setStatus(result.serviceable ? 'available' : 'unavailable');
    }, 400);
  };

  // ── Submit ───────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      editId
        ? await authService.updateAddress(editId, form)
        : await authService.createAddress(form);
      await load();
      closeForm();
    } catch (err: any) {
      alert(err.message || 'Failed to save address');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this address?')) return;
    try { await authService.deleteAddress(id); await load(); }
    catch (err: any) { alert(err.message || 'Failed to delete'); }
  };

  const handleEdit = (addr: UserAddress) => {
    setForm({
      type: addr.type, line1: addr.line1, line2: addr.line2 || '',
      postal_code: addr.postal_code, city: addr.city, state: addr.state || '',
      is_default: addr.is_default,
    });
    setEditId(addr.id);
    setCityAuto(false); setStateAuto(false); setStatus('idle');
    setShowForm(true);
    if (addr.postal_code.length === 6) handlePincodeChange(addr.postal_code);
  };

  const closeForm = () => {
    setShowForm(false); setEditId(null); setForm(EMPTY);
    setCityAuto(false); setStateAuto(false);
    setStatus('idle'); setAvailCity('');
  };

  const inp = 'w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-teal-500 transition-colors bg-white';

  return (
    <section className="bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-extrabold text-gray-900">My Addresses</h1>
          {!showForm && (
            <button onClick={() => { closeForm(); setShowForm(true); }}
              className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 text-white rounded-xl font-semibold text-sm hover:bg-teal-700 transition-colors">
              <Plus size={16} /> Add Address
            </button>
          )}
        </div>

        {/* ── Form ──────────────────────────────────────────────────────────── */}
        {showForm && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-lg text-gray-900">{editId ? 'Edit' : 'New'} Address</h3>
              <button onClick={closeForm} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                <X size={18} />
              </button>
            </div>

            {/* GPS Button */}
            {!editId && (
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                disabled={locating}
                className="w-full mb-6 flex items-center justify-center gap-2 py-3.5 px-4 border-2 border-dashed border-teal-200 rounded-xl text-teal-600 font-bold text-sm hover:bg-teal-50 hover:border-teal-400 transition-all disabled:opacity-60"
              >
                {locating ? <Loader2 size={16} className="animate-spin" /> : <Navigation size={16} />}
                {locating ? 'Detecting your location...' : 'Use Current Location'}
              </button>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Type */}
              <div className="flex gap-2">
                {(['home', 'office', 'other'] as const).map(t => (
                  <button key={t} type="button" onClick={() => setForm(p => ({ ...p, type: t }))}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold capitalize border-2 transition-colors ${
                      form.type === t ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-gray-200 text-gray-500'
                    }`}>{t}</button>
                ))}
              </div>

              {/* Line 1 (House/Flat) */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">House / Flat / Building *</label>
                <input type="text" placeholder="e.g. 12B, Green Residency"
                  value={form.line1} required className={inp}
                  onChange={e => setForm(p => ({ ...p, line1: e.target.value }))} />
              </div>

              {/* Pincode */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Pincode *</label>
                <input
                  type="text" inputMode="numeric" placeholder="6-digit pincode"
                  value={form.postal_code} maxLength={6} required
                  onChange={e => handlePincodeChange(e.target.value)}
                  className={`${inp} font-mono tracking-widest text-base ${
                    status === 'available'   ? 'border-emerald-400 focus:border-emerald-400' :
                    status === 'unavailable' ? 'border-amber-400  focus:border-amber-400'  :
                    status === 'invalid'     ? 'border-red-400    focus:border-red-400'    : ''
                  }`}
                />
                <StatusBadge status={status} city={availCity} />
              </div>

              {/* City */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">City *</label>
                <AutoField
                  placeholder="Auto-filled from pincode"
                  value={form.city} autoFilled={cityAuto} required
                  onChange={v => setForm(p => ({ ...p, city: v }))}
                  onOverride={() => setCityAuto(false)}
                />
              </div>

              {/* State */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">State *</label>
                <AutoField
                  placeholder="Auto-filled from pincode"
                  value={form.state} autoFilled={stateAuto} required
                  onChange={v => setForm(p => ({ ...p, state: v }))}
                  onOverride={() => setStateAuto(false)}
                />
              </div>

              {/* Line 2 (Area/Nearby) */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                  Area / Street / Nearby <span className="ml-1 font-normal text-gray-400">(optional)</span>
                </label>
                <input type="text" placeholder="e.g. Near City Mall, MG Road"
                  value={form.line2} className={inp}
                  onChange={e => setForm(p => ({ ...p, line2: e.target.value }))} />
              </div>

              {/* Default toggle */}
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <div onClick={() => setForm(p => ({ ...p, is_default: !p.is_default }))}
                  className={`w-10 h-5 rounded-full relative transition-colors ${form.is_default ? 'bg-teal-500' : 'bg-gray-300'}`}>
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.is_default ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </div>
                <span className="text-sm text-gray-600">Set as default address</span>
              </label>

              {/* Buttons */}
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={closeForm}
                  className="flex-1 py-3 border-2 border-gray-200 text-gray-600 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-3 bg-teal-600 text-white rounded-xl font-semibold text-sm hover:bg-teal-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                  {saving ? <><Loader2 size={15} className="animate-spin" /> Saving…</> : 'Save Address'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* List Section (Addresses) */}
        {loading && !showForm ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={28} className="animate-spin text-teal-500" />
          </div>
        ) : addresses.length === 0 && !showForm ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <MapPin size={26} className="text-gray-300" />
            </div>
            <h3 className="font-bold text-gray-700 mb-1">No addresses yet</h3>
            <p className="text-sm text-gray-400 mb-4">Add an address to schedule pickups</p>
            <button onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white rounded-xl font-semibold text-sm hover:bg-teal-700 transition-colors">
              <Plus size={16} /> Add First Address
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {addresses.map(addr => (
              <div key={addr.id}
                className={`bg-white border-2 rounded-2xl p-5 transition-all ${addr.is_default ? 'border-teal-300' : 'border-gray-100'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`p-2 rounded-xl mt-0.5 flex-shrink-0 ${addr.is_default ? 'bg-teal-100' : 'bg-gray-100'}`}>
                      <MapPin size={15} className={addr.is_default ? 'text-teal-600' : 'text-gray-400'} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold uppercase tracking-wide text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">{addr.type}</span>
                        {addr.is_default && (
                          <span className="text-xs font-bold text-teal-700 bg-teal-100 px-2 py-0.5 rounded-md">Default</span>
                        )}
                      </div>
                      <p className="font-semibold text-gray-900 mt-1.5 text-sm">{addr.line1}</p>
                      {addr.line2 && <p className="text-xs text-gray-500">{addr.line2}</p>}
                      <p className="text-sm text-gray-600 mt-0.5">
                        {addr.city}, {addr.state} – <span className="font-mono text-xs">{addr.postal_code}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => handleEdit(addr)} title="Edit"
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(addr.id)} title="Delete"
                      className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MyAddressesPage;