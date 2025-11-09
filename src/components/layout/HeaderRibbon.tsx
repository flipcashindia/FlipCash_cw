import React from 'react';
import { Facebook, Instagram } from 'lucide-react';

const XIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const HeaderRibbon: React.FC = () => {
  const ribbonMessages = [
    'New Pickup Requests Available',
    'Instant Commission Payouts',
    'Earn More on High-Value Devices',
    'Grow Your Business With Flipcash',
  ];

  return (
    <div className="bg-black text-white py-2 overflow-hidden relative flex items-center h-[40px]">
      <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center px-4 md:px-6 space-x-3 bg-black">
        <a href="#" aria-label="Facebook" className="hover:opacity-70 transition-opacity">
          <Facebook size={18} />
        </a>
        <a href="#" aria-label="Instagram" className="hover:opacity-70 transition-opacity">
          <Instagram size={18} />
        </a>
        <a href="#" aria-label="X" className="hover:opacity-70 transition-opacity">
          <XIcon />
        </a>
      </div>

      <div className="flex whitespace-nowrap animate-infinite-scroll" style={{ paddingLeft: '120px' }}>
        {ribbonMessages.map((message, index) => (
          <div key={`first-${index}`} className="flex items-center mx-4">
            <span className="w-1.5 h-1.5 bg-white rounded-full mr-3"></span>
            <span>{message}</span>
          </div>
        ))}
        {ribbonMessages.map((message, index) => (
          <div key={`second-${index}`} className="flex items-center mx-4">
            <span className="w-1.5 h-1.5 bg-white rounded-full mr-3"></span>
            <span>{message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeaderRibbon;