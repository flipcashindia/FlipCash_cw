import React, { useState } from 'react';
import { 
  X, Search, Navigation, 
  Loader2, Globe
} from 'lucide-react';
import { useCityContext } from '../../context/CityContext';
import apiClient from '../../api/client/apiClient';

// ─────────────────────────────────────────────────────────────────────────────
// CITY LANDMARK SVG ICONS
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
      <rect x="16" y="44" width="8" height="20" rx="1" fill="#1DB8A0" stroke="#1C1C1B" strokeWidth="1.5"/>
      <path d="M16 44 Q20 38 24 44" fill="#1DB8A0" stroke="#1C1C1B" strokeWidth="1.5"/>
      <rect x="56" y="44" width="8" height="20" rx="1" fill="#1DB8A0" stroke="#1C1C1B" strokeWidth="1.5"/>
      <path d="M56 44 Q60 38 64 44" fill="#1DB8A0" stroke="#1C1C1B" strokeWidth="1.5"/>
      <rect x="14" y="64" width="52" height="4" rx="1" fill="#1C1C1B"/>
    </svg>
  ),
  Bangalore: ({ size = 64, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" className={className}>
      <ellipse cx="40" cy="16" rx="10" ry="8" fill="#1DB8A0" stroke="#1C1C1B" strokeWidth="1.5"/>
      <line x1="40" y1="8" x2="40" y2="4" stroke="#1C1C1B" strokeWidth="1.5"/>
      <polygon points="40,2 42,6 38,6" fill="#FEC925" stroke="#1C1C1B" strokeWidth="0.5"/>
      <rect x="22" y="24" width="36" height="10" rx="1" fill="#1DB8A0" stroke="#1C1C1B" strokeWidth="1.5"/>
      <rect x="26" y="34" width="28" height="22" rx="1" fill="#1DB8A0" stroke="#1C1C1B" strokeWidth="1.5"/>
      {[30,36,42,48].map(x => (
        <rect key={x} x={x} y="34" width="4" height="22" rx="0.5" fill="white" fillOpacity="0.4" stroke="#1C1C1B" strokeWidth="1"/>
      ))}
      <rect x="20" y="56" width="40" height="4" rx="0.5" fill="#1DB8A0" stroke="#1C1C1B" strokeWidth="1.5"/>
      <rect x="16" y="60" width="48" height="4" rx="0.5" fill="#1DB8A0" stroke="#1C1C1B" strokeWidth="1.5"/>
      <rect x="12" y="64" width="56" height="4" rx="1" fill="#1C1C1B"/>
    </svg>
  ),
  Chennai: ({ size = 64, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" className={className}>
      <polygon points="40,6 52,22 28,22" fill="#1DB8A0" stroke="#1C1C1B" strokeWidth="1.5"/>
      <rect x="30" y="22" width="20" height="8" rx="0.5" fill="#1DB8A0" stroke="#1C1C1B" strokeWidth="1.5"/>
      <polygon points="40,30 50,42 30,42" fill="#1DB8A0" stroke="#1C1C1B" strokeWidth="1.5"/>
      <rect x="28" y="42" width="24" height="8" rx="0.5" fill="#1DB8A0" stroke="#1C1C1B" strokeWidth="1.5"/>
      <rect x="24" y="50" width="32" height="14" rx="1" fill="#1DB8A0" stroke="#1C1C1B" strokeWidth="1.5"/>
      {[28,34,40,46].map(x => (
        <rect key={x} x={x} y="52" width="3.5" height="12" rx="0.5" fill="white" fillOpacity="0.5" stroke="#1C1C1B" strokeWidth="0.5"/>
      ))}
      {[8,10,12].map((y,i) => <circle key={i} cx={40} cy={y} r="1.5" fill="#FEC925"/>)}
      <rect x="16" y="64" width="48" height="4" rx="1" fill="#1C1C1B"/>
    </svg>
  ),
  Hyderabad: ({ size = 64, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" className={className}>
      {[18,54].map(x => [
        <rect key={`t-${x}`} x={x-3} y="14" width="6" height="28" rx="1" fill="#1DB8A0" stroke="#1C1C1B" strokeWidth="1.5"/>,
        <ellipse key={`d-${x}`} cx={x} cy="14" rx="5" ry="7" fill="#1DB8A0" stroke="#1C1C1B" strokeWidth="1.5"/>,
        <line key={`l-${x}`} x1={x} y1="7" x2={x} y2="4" stroke="#1C1C1B" strokeWidth="1.5"/>,
        <circle key={`c-${x}`} cx={x} cy="3" r="2" fill="#FEC925" stroke="#1C1C1B" strokeWidth="1"/>,
      ])}
      <rect x="22" y="36" width="36" height="28" rx="1" fill="#1DB8A0" stroke="#1C1C1B" strokeWidth="1.5"/>
      <path d="M28 64 L28 50 Q28 44 34 44 Q40 44 40 50 L40 64" fill="white" fillOpacity="0.3" stroke="#1C1C1B" strokeWidth="1"/>
      <path d="M40 64 L40 50 Q40 44 46 44 Q52 44 52 50 L52 64" fill="white" fillOpacity="0.3" stroke="#1C1C1B" strokeWidth="1"/>
      <ellipse cx="40" cy="36" rx="10" ry="7" fill="#1DB8A0" stroke="#1C1C1B" strokeWidth="1.5"/>
      <rect x="14" y="64" width="52" height="4" rx="1" fill="#1C1C1B"/>
    </svg>
  ),
  Kolkata: ({ size = 64, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" className={className}>
      <rect x="12" y="22" width="10" height="44" rx="1" fill="#1DB8A0" stroke="#1C1C1B" strokeWidth="1.5"/>
      <rect x="58" y="22" width="10" height="44" rx="1" fill="#1DB8A0" stroke="#1C1C1B" strokeWidth="1.5"/>
      <polygon points="17,10 22,22 12,22" fill="#1DB8A0" stroke="#1C1C1B" strokeWidth="1.5"/>
      <polygon points="63,10 68,22 58,22" fill="#1DB8A0" stroke="#1C1C1B" strokeWidth="1.5"/>
      <path d="M17 14 Q40 42 63 14" stroke="#1C1C1B" strokeWidth="1.5" fill="none"/>
      <path d="M17 18 Q40 46 63 18" stroke="#1C1C1B" strokeWidth="1" fill="none"/>
      {[26,32,38,44,50,56].map(x => (
        <line key={x} x1={x} y1={22 + (x-17)*(46-22)/(63-17) - 2} x2={x} y2="56" stroke="#1C1C1B" strokeWidth="0.8"/>
      ))}
      <rect x="10" y="54" width="60" height="6" rx="1" fill="#1DB8A0" stroke="#1C1C1B" strokeWidth="1.5"/>
      <path d="M8 66 Q20 62 32 66 Q44 70 56 66 Q68 62 72 66 L72 72 L8 72 Z" fill="#1DB8A0" fillOpacity="0.3" stroke="#1C1C1B" strokeWidth="1"/>
    </svg>
  ),
  Noida: ({ size = 64, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" className={className}>
      <rect x="30" y="10" width="20" height="54" rx="2" fill="#1DB8A0" stroke="#1C1C1B" strokeWidth="1.5"/>
      {[14,20,26,32,38,44,50].map(y => (
        <rect key={y} x="33" y={y} width="6" height="4" rx="0.5" fill="white" fillOpacity="0.6" stroke="#1C1C1B" strokeWidth="0.5"/>
      ))}
      <line x1="40" y1="10" x2="40" y2="4" stroke="#1C1C1B" strokeWidth="1.5"/>
      <circle cx="40" cy="3" r="2" fill="#FEC925" stroke="#1C1C1B" strokeWidth="1"/>
      <rect x="12" y="28" width="16" height="36" rx="2" fill="#1DB8A0" stroke="#1C1C1B" strokeWidth="1.5"/>
      {[30,36,42,48,54].map(y => (
        <rect key={y} x="15" y={y} width="4" height="3" rx="0.5" fill="white" fillOpacity="0.5" stroke="#1C1C1B" strokeWidth="0.5"/>
      ))}
      <rect x="52" y="32" width="16" height="32" rx="2" fill="#1DB8A0" stroke="#1C1C1B" strokeWidth="1.5"/>
      {[34,40,46,52,58].map(y => (
        <rect key={y} x="55" y={y} width="4" height="3" rx="0.5" fill="white" fillOpacity="0.5" stroke="#1C1C1B" strokeWidth="0.5"/>
      ))}
      <rect x="10" y="64" width="60" height="4" rx="1" fill="#1C1C1B"/>
    </svg>
  ),
  Gurgaon: ({ size = 64, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" className={className}>
      <rect x="10" y="16" width="14" height="48" rx="2" fill="#1DB8A0" stroke="#1C1C1B" strokeWidth="1.5"/>
      {[18,24,30,36,42,48,54].map(y => (
        <rect key={y} x="13" y={y} width="5" height="3.5" rx="0.5" fill="white" fillOpacity="0.6" stroke="#1C1C1B" strokeWidth="0.3"/>
      ))}
      <line x1="17" y1="16" x2="17" y2="10" stroke="#1C1C1B" strokeWidth="1.5"/>
      <circle cx="17" cy="9" r="2" fill="#FEC925" stroke="#1C1C1B" strokeWidth="1"/>
      <rect x="30" y="8" width="20" height="56" rx="2" fill="#1DB8A0" stroke="#1C1C1B" strokeWidth="1.5"/>
      {[10,16,22,28,34,40,46,52,58].map(y => (
        <rect key={y} x="33" y={y} width="6" height="4" rx="0.5" fill="white" fillOpacity="0.5" stroke="#1C1C1B" strokeWidth="0.3"/>
      ))}
      <line x1="40" y1="8" x2="40" y2="3" stroke="#1C1C1B" strokeWidth="1.5"/>
      <circle cx="40" cy="2" r="2.5" fill="#FEC925" stroke="#1C1C1B" strokeWidth="1"/>
      <rect x="56" y="22" width="14" height="42" rx="2" fill="#1DB8A0" stroke="#1C1C1B" strokeWidth="1.5"/>
      {[24,30,36,42,48,54,60].map(y => (
        <rect key={y} x="59" y={y} width="5" height="3.5" rx="0.5" fill="white" fillOpacity="0.6" stroke="#1C1C1B" strokeWidth="0.3"/>
      ))}
      <rect x="8" y="64" width="64" height="4" rx="1" fill="#1C1C1B"/>
    </svg>
  ),
  Pune: ({ size = 64, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" className={className}>
      <rect x="24" y="30" width="32" height="34" rx="1" fill="#1DB8A0" stroke="#1C1C1B" strokeWidth="1.5"/>
      <path d="M33 64 L33 48 Q33 40 40 40 Q47 40 47 48 L47 64" fill="#1C1C1B" fillOpacity="0.3" stroke="#1C1C1B" strokeWidth="1.5"/>
      {[24,28,32,36,40,44,48,52].map(x => (
        <rect key={x} x={x} y="22" width="3" height="8" rx="0.5" fill="#1DB8A0" stroke="#1C1C1B" strokeWidth="1"/>
      ))}
      <rect x="22" y="30" width="36" height="4" rx="0.5" fill="#1DB8A0" stroke="#1C1C1B" strokeWidth="1.5"/>
      <rect x="14" y="34" width="10" height="30" rx="1" fill="#1DB8A0" stroke="#1C1C1B" strokeWidth="1.5"/>
      {[36,42,48,54,60].map(y => (
        <rect key={y} x="16" y={y} width="6" height="3" rx="0.5" fill="white" fillOpacity="0.4" stroke="#1C1C1B" strokeWidth="0.5"/>
      ))}
      <rect x="12" y="28" width="12" height="6" rx="0.5" fill="#1DB8A0" stroke="#1C1C1B" strokeWidth="1.5"/>
      <rect x="56" y="34" width="10" height="30" rx="1" fill="#1DB8A0" stroke="#1C1C1B" strokeWidth="1.5"/>
      {[36,42,48,54,60].map(y => (
        <rect key={y} x="58" y={y} width="6" height="3" rx="0.5" fill="white" fillOpacity="0.4" stroke="#1C1C1B" strokeWidth="0.5"/>
      ))}
      <rect x="56" y="28" width="12" height="6" rx="0.5" fill="#1DB8A0" stroke="#1C1C1B" strokeWidth="1.5"/>
      <rect x="10" y="64" width="60" height="4" rx="1" fill="#1C1C1B"/>
    </svg>
  ),
  _default: ({ size = 64, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" className={className}>
      <rect x="28" y="20" width="24" height="44" rx="2" fill="#1DB8A0" stroke="#1C1C1B" strokeWidth="1.5"/>
      {[22,28,34,40,46,52,58].map(y => (
        <rect key={y} x="31" y={y} width="7" height="4" rx="0.5" fill="white" fillOpacity="0.5" stroke="#1C1C1B" strokeWidth="0.5"/>
      ))}
      <line x1="40" y1="20" x2="40" y2="14" stroke="#1C1C1B" strokeWidth="1.5"/>
      <circle cx="40" cy="13" r="2" fill="#FEC925" stroke="#1C1C1B" strokeWidth="1"/>
      <rect x="12" y="36" width="14" height="28" rx="2" fill="#1DB8A0" stroke="#1C1C1B" strokeWidth="1.5"/>
      <rect x="54" y="40" width="14" height="24" rx="2" fill="#1DB8A0" stroke="#1C1C1B" strokeWidth="1.5"/>
      <rect x="10" y="64" width="60" height="4" rx="1" fill="#1C1C1B"/>
    </svg>
  ),
};

function getCityIcon(cityName: string): React.FC<{ size?: number; className?: string }> {
  return CITY_ICONS[cityName] ?? CITY_ICONS._default;
}

// ─────────────────────────────────────────────────────────────────────────────
// POPULAR CITIES LIST
// ─────────────────────────────────────────────────────────────────────────────
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
    isCityModalOpen, 
    closeCityModal, 
    setSelectedCity, 
    setSelectedPincode, 
    setSelectedState,
    setIsServiceAvailable 
  } = useCityContext();

  const [search, setSearch] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);
  const [viewAll, setViewAll] = useState(false);

  const handleSelect = async (city: string, state: string, pincode: string | null = null) => {
    setSelectedCity(city);
    setSelectedState(state);
    if (pincode) setSelectedPincode(pincode);

    try {
      const q = pincode || city;
      const { data } = await apiClient.get(`/accounts/pincode-resolve/?q=${q}`);
      setIsServiceAvailable(data.serviceable);
    } catch (err) {
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
                <button 
                  onClick={handleDetectLocation}
                  className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 text-[#1DB8A0] font-bold border-b border-gray-50 transition-colors"
                >
                  {isDetecting ? <Loader2 className="animate-spin" size={18} /> : <Navigation size={18} />}
                  <span>Detect My Location</span>
                </button>
              </div>
            )}
          </div>

          {!viewAll ? (
            <>
              {/* Popular Cities with Graphic SVGs */}
              <div className="mb-12">
                <div className="flex items-center gap-2 mb-8">
                  <div className="h-1 w-6 bg-[#FEC925] rounded-full" />
                  <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Popular Cities</h3>
                </div>
                
                <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-6">
                  {POPULAR_CITIES.map((city) => {
                    const CityIcon = getCityIcon(city.name);
                    return (
                      <button 
                        key={city.name}
                        onClick={() => handleSelect(city.name, city.state)}
                        className="flex flex-col items-center gap-3 group"
                      >
                        <div className="relative w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-[#1DB8A0]/10 group-hover:scale-110 transition-all duration-300 border border-transparent group-hover:border-[#1DB8A0]/20">
                          <CityIcon size={40} />
                        </div>
                        <span className="text-[11px] font-black text-gray-600 group-hover:text-gray-900 text-center uppercase tracking-tight">
                          {city.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="text-center">
                <button 
                  onClick={() => setViewAll(true)}
                  className="px-8 py-3 bg-gray-50 hover:bg-[#FEC925] text-gray-900 font-black rounded-2xl transition-all border border-gray-100"
                >
                  View All Cities
                </button>
              </div>
            </>
          ) : (
            /* Alphabetical Order */
            <div className="animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="text-xs font-bold text-gray-400">Alphabetical Order :</span>
                  {ALPHABET.map(char => (
                    <button key={char} className="w-6 h-6 flex items-center justify-center text-xs font-black text-gray-700 hover:text-[#1DB8A0] hover:bg-emerald-50 rounded-md transition-colors">
                      {char}
                    </button>
                  ))}
                </div>
                <button onClick={() => setViewAll(false)} className="text-xs font-black text-[#1DB8A0] hover:underline">Back to Popular</button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-4 gap-x-8">
                {['Dehradun', 'Dehri on Sone', 'Dehurda', 'Delhi', 'Demow', 'Deoband', 'Deodar', 'Deoghar', 'Deoria'].map((name) => (
                  <button 
                    key={name}
                    onClick={() => handleSelect(name, "State")}
                    className="text-left text-sm font-bold text-gray-600 hover:text-[#1DB8A0] transition-colors flex items-center gap-2 group"
                  >
                    {name === 'Delhi' && <div className="w-2 h-2 rounded-full bg-[#1DB8A0]" />}
                    <span className={name === 'Delhi' ? 'text-[#1DB8A0]' : ''}>{name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
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