import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Edit2, Trash2 } from 'lucide-react';
import * as authService from '../../api/services/authService';
import type { UserAddress, CreateAddressRequest } from '../../api/types/auth.types';
import type { MenuTab } from './MyAccountPage';

interface MyAddressesPageProps {
  username: string;
  onNavClick: (tab: MenuTab) => void;
  onBreadcrumbClick: (path: string) => void;
  onLogout: () => void;
}

const MyAddressesPage: React.FC<MyAddressesPageProps> = ({ username, onNavClick, onBreadcrumbClick, onLogout }) => {
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState<CreateAddressRequest>({
    address_type: 'home',
    full_name: '',
    phone: '',
    line1: '',
    line2: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
    is_default: false,
  });

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const data = await authService.getAddresses();
      setAddresses(data);
    } catch (error) {
      console.error('Failed to load addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        await authService.updateAddress(editId, formData);
      } else {
        await authService.createAddress(formData);
      }
      await loadAddresses();
      setShowForm(false);
      setEditId(null);
      resetForm();
    } catch (error: any) {
      alert(error.message || 'Failed to save address');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this address?')) return;
    try {
      await authService.deleteAddress(id);
      await loadAddresses();
    } catch (error: any) {
      alert(error.message || 'Failed to delete address');
    }
  };

  const handleEdit = (address: UserAddress) => {
    setFormData({
      type: address.type,
      line1: address.line1,
      line2: address.line2 || '',
      city: address.city,
      state: address.state || "Delhi",
      postal_code: address.postal_code,
      is_default: address.is_default,
    });
    setEditId(address.id);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      type: 'home',
      line1: '',
      line2: '',
      city: '',
      state: 'Delhi',
      postal_code: '',
      is_default: false,
    });
  };

  return (
    <section className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Addresses</h1>
          <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
            <Plus size={20} /> Add Address
          </button>
        </div>

        {showForm && (
          <div className="bg-white border rounded-xl p-6 mb-8">
            <h3 className="font-bold text-xl mb-4">{editId ? 'Edit' : 'Add'} Address</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* <input type="text" placeholder="Full Name" value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} className="w-full p-3 border rounded-lg" required /> */}
              {/* <input type="tel" placeholder="Phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full p-3 border rounded-lg" required /> */}
              <input type="text" placeholder="Address Line 1" value={formData.line1} onChange={(e) => setFormData({...formData, line1: e.target.value})} className="w-full p-3 border rounded-lg" required />
              <input type="text" placeholder="Address Line 2" value={formData.line2} onChange={(e) => setFormData({...formData, line2: e.target.value})} className="w-full p-3 border rounded-lg" />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="City" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="w-full p-3 border rounded-lg" required />
                <input type="text" placeholder="State" value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})} className="w-full p-3 border rounded-lg" required />
              </div>
              <input type="text" placeholder="Pincode" value={formData.postal_code} onChange={(e) => setFormData({...formData, postal_code: e.target.value})} className="w-full p-3 border rounded-lg" maxLength={6} required />
              <div className="flex gap-4">
                <button type="button" onClick={() => { setShowForm(false); setEditId(null); }} className="flex-1 py-3 border rounded-lg">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700">Save</button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-4">
          {addresses.map(addr => (
            <div key={addr.id} className="bg-white border rounded-lg p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold">{addr.line1}</p>
                  <p>{addr.line1}, {addr.city}</p>
                  <p>{addr.state} - {addr.postal_code}</p>
                  <p className="text-gray-600">{addr.country}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(addr)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit2 size={20} /></button>
                  <button onClick={() => handleDelete(addr.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 size={20} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MyAddressesPage;