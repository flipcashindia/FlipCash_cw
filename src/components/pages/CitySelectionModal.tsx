import React, { useEffect, useState } from 'react';
import { 
  X, Search, Navigation, 
  Loader2, Globe, CheckCircle
} from 'lucide-react';
import { useCityContext } from '../../context/CityContext';
import apiClient from '../../api/client/apiClient';

// ─────────────────────────────────────────────────────────────────────────────
// CITY LANDMARK SVG ICONS (From PartnerAreaPage)
// ─────────────────────────────────────────────────────────────────────────────
const CITY_ICONS: Record<string, React.FC<{ size?: number; className?: string }>> = {
  Delhi: ({ size = 64, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" className={className}>
      <rect x="36" y="8" width="8" height="6" rx="1" fill="#1DB8A0" stroke="#1C1C1B" strokeWidth="1.5"/>
      <path d="M24 38 Q40 18 56 38" stroke="#1C1C1B" strokeWidth="2" fill="#1DB8A0" fillOpacity="0.3"/>
      <rect x="22" y="38" width="8" height="28" rx="1" fill="#1DB8A0" stroke="#1C1C1B" strokeWidth="1.5"/>
      <rect x="50" y="38" width="8" height="28" rx="1" fill="#1DB8A0" stroke="#1C1C1B" strokeWidth="1.5"/>
      <rect x="30" y="52" width="20" height="14" rx="1" fill="#1DB8A0" stroke="#1C1C1B" strokeWidth="1.5"/>
      <path d="M30 52 Q40 44 50 52" stroke="#1C1C1B" strokeWidth="1.5" fill="#1DB8A0"/>
      <rect x="18" y="64" width="44" height="4" rx="1" fill="#1C1C1B"/>
      <line x1="16" y1="46" x2="16" y2="64" stroke="#1C1C1B" strokeWidth="1.5"/>
      <circle cx="16" cy="44" r="2.5" fill="#FEC925" stroke="#1C1C1B" strokeWidth="1"/>
      <line x1="64" y1="46" x2="64" y2="64" stroke="#1C1C1B" strokeWidth="1.5"/>
      <circle cx="64" cy="44" r="2.5" fill="#FEC925" stroke="#1C1C1B" strokeWidth="1"/>
    </svg>
  ),
  Mumbai: ({ size = 64, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" className={className}>
      <path d="M20 64 L20 42 Q20 34 28 34 L52 34 Q60 34 60 42 L60 64" stroke="#1C1C1B" strokeWidth="2" fill="#1DB8A0" fillOpacity="0.2"/>
      <path d="M28 64 L28 46 Q28 38 40 38 Q52 38 52 46 L52 64" fill="#1DB8A0" stroke="#1C1C1B" strokeWidth="1.5"/>
      <path d="M28 46 Q40 32 52 46" fill="none" stroke="#1C1C1B" strokeWidth="2"/>
      <ellipse cx="40" cy="26" rx="8" ry="6" fill="#1DB8A0" stroke="#1C1C1B" strokeWidth="1.5"/>
      <line x1="40" y1="20" x2="40" y2="14" stroke="#1C1C1B" strokeWidth="1.5"/>
      <circle cx="40" cy="13" r="2" fill="#FEC925" stroke="#1C1C1B" strokeWidth="1"/>
      <rect x="14" y="64" width="52" height="4" rx="1" fill="#1C1C1B"/>
    </svg>
  ),
  // ... Other icons as defined in your code
  _default: ({ size = 64, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" className={className}>
      <rect x="28" y="20" width="24" height="44" rx="2" fill="#1DB8A0" stroke="#1C1C1B" strokeWidth="1.5"/>
      <line x1="40" y1="20" x2="40" y2="14" stroke="#1C1C1B" strokeWidth="1.5"/>
      <circle cx="40" cy="13" r="2" fill="#FEC925" stroke="#1C1C1B" strokeWidth="1"/>
      <rect x="10" y="64" width="60" height="4" rx="1" fill="#1C1C1B"/>
    </svg>
  ),
};

function getCityIcon(cityName: string): React.FC<{ size?: number; className?: string }> {
  return CITY_ICONS[cityName] ?? CITY_ICONS._default;
}

const POPULAR_CITIES = [
  { name: 'Bangalore', state: 'Karnataka' },
  { name: 'Chennai', state: 'Tamil Nadu' },
  { name: 'Delhi', state: 'Delhi' },
  { name: 'Gurgaon', state: 'Haryana' },
  { name: 'Hyderabad', state: 'Telangana' },
  { name: 'Kolkata', state: 'West Bengal' },
  { name: 'Mumbai', state: 'Maharashtra' },
  { name: 'Noida', state: 'Uttar Pradesh' },
  { name: 'Pune', state: 'Maharashtra' },
];

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const CityPickerModal: React.FC = () => {
  const { 
    isCityModalOpen, closeCityModal, selectedCity,
    setSelectedCity, setSelectedPincode, setSelectedState,
    setIsServiceAvailable , isServiceAvailable
  } = useCityContext();

  const [search, setSearch] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);
  const [viewAll, setViewAll] = useState(false);



  useEffect(() => {
    if (selectedCity && isCityModalOpen === false) {
      // Re-verify serviceability silently whenever the app loads with a saved city
      apiClient.get(`/accounts/pincode-resolve/?q=${selectedCity}`)
        .then(({ data }) => setIsServiceAvailable(data.serviceable))
        .catch(() => setIsServiceAvailable(true)); // Fail open
    }
    console.log('City Modal Mounted. Current City:', selectedCity);
    console.log('Initial Serviceability:', isServiceAvailable);
  }, []);

  const handleSelect = async (city: string, state: string, pincode: string | null = null) => {
    console.log('🏙️ City Selected:', city);

    // 1. Update Context States (The useEffect in Context will handle the storage automatically)
    setSelectedCity(city);
    setSelectedState(state);
    setSelectedPincode(pincode || '');

    // 2. Resolve Serviceability
    try {
      const q = pincode || city;
      const { data } = await apiClient.get(`/accounts/pincode-resolve/?q=${q}`);
      console.log('Serviceability Response:', data);
      setIsServiceAvailable(data.serviceable);
    } catch (err) {
      console.warn('Network error: Defaulting to available');
      setIsServiceAvailable(true); 
    }
    closeCityModal();
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const { latitude, longitude } = pos.coords;
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
        const data = await res.json();
        const addr = data.address;
        handleSelect(addr.city || addr.town || addr.village || 'Delhi', addr.state || '', addr.postcode || null);
      } catch (err) {
        alert("Could not detect location.");
      } finally {
        setIsDetecting(false);
      }
    }, () => setIsDetecting(false));
  };

  

  if (!isCityModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md" onClick={closeCityModal} />

      <div className="relative w-full max-w-4xl bg-white rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="px-8 py-6 flex items-center justify-between border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Pick your city</h2>
            <p className="text-sm text-gray-500 font-medium">To provide you the best price & service</p>
          </div>
          <button onClick={closeCityModal} className="p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all">
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        <div className="p-8 overflow-y-auto max-h-[85vh] custom-scrollbar">
          {/* Search Section */}
          <div className="relative max-w-2xl mx-auto mb-10">
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1DB8A0] transition-colors" size={22} />
              <input 
                type="text"
                placeholder="Search your city or pincode"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-14 pr-6 py-5 bg-gray-50 border-2 border-transparent focus:border-[#FEC925] focus:bg-white rounded-3xl outline-none transition-all font-bold text-gray-800 shadow-sm"
              />
            </div>
            {search && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-10">
                <button onClick={handleDetectLocation} className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 text-[#1DB8A0] font-bold transition-colors">
                  {isDetecting ? <Loader2 className="animate-spin" size={18} /> : <Navigation size={18} />}
                  <span>Detect My Location</span>
                </button>
              </div>
            )}
          </div>

          {!viewAll ? (
            <>
              <div className="mb-12">
                <div className="flex items-center gap-2 mb-8">
                  <div className="h-1 w-6 bg-[#FEC925] rounded-full" />
                  <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Popular Cities</h3>
                </div>
                
                <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-6">
                  {POPULAR_CITIES.map((city) => {
                    const CityIcon = getCityIcon(city.name);
                    const isSelected = selectedCity === city.name;
                    return (
                      <button 
                        key={city.name}
                        onClick={() => handleSelect(city.name, city.state)}
                        className="flex flex-col items-center gap-3 group relative"
                      >
                        <div className={`relative w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 border-2 ${
                          isSelected 
                          ? 'bg-[#1DB8A0]/10 border-[#1DB8A0]' 
                          : 'bg-gray-50 border-transparent group-hover:bg-[#1DB8A0]/10 group-hover:scale-110'
                        }`}>
                          <CityIcon size={40} />
                          {isSelected && (
                            <div className="absolute -top-1 -right-1 bg-white rounded-full">
                              <CheckCircle size={14} className="text-[#1DB8A0] fill-white" />
                            </div>
                          )}
                        </div>
                        <span className={`text-[11px] font-black uppercase tracking-tight text-center ${
                          isSelected ? 'text-[#1DB8A0]' : 'text-gray-600 group-hover:text-gray-900'
                        }`}>
                          {city.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="text-center">
                <button onClick={() => setViewAll(true)} className="px-8 py-3 bg-gray-50 hover:bg-[#FEC925] text-gray-900 font-black rounded-2xl transition-all border border-gray-100">
                  View All Cities
                </button>
              </div>
            </>
          ) : (
            <div className="animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="text-xs font-bold text-gray-400">Alphabetical Order :</span>
                  {ALPHABET.map(char => (
                    <button key={char} className="w-6 h-6 flex items-center justify-center text-xs font-black text-gray-700 hover:text-[#1DB8A0] hover:bg-emerald-50 rounded-md">
                      {char}
                    </button>
                  ))}
                </div>
                <button onClick={() => setViewAll(false)} className="text-xs font-black text-[#1DB8A0] hover:underline">Back to Popular</button>
              </div>
              {/* Filtered city list goes here */}
            </div>
          )}
        </div>
        
        <div className="px-8 py-4 bg-gray-50 flex items-center gap-3">
          <Globe size={14} className="text-gray-400" />
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            FlipCash service is currently available in 500+ major cities across India
          </p>
        </div>
      </div>
    </div>
  );
};

export default CityPickerModal;