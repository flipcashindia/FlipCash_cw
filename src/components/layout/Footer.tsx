import React from 'react';
import { Facebook, Instagram, Linkedin, MapPin, Mail, Phone, ArrowRight } from 'lucide-react';
import flipcashLogo from '../../assets/logo.png'; // <-- 1. UNCOMMENT THIS if your logo is at src/assets/logo.png

// --- Custom X Icon ---
const XIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932L18.901 1.153Zm-1.16 19.5h1.85l-10.5-12.03L3.18 3.05H1.33l10.8 12.35 6.01 5.303Z"/>
  </svg>
);

// --- Custom Payment Icons ---
const GPayIcon = () => (
  <svg width="40" height="16" viewBox="0 0 50 20" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.17 6.38c0-1.04.3-1.8.92-2.3a3.1 3.1 0 012.33-.8c1.23 0 2.15.34 2.76 1.02.6.68.9 1.6.9 2.75v.2c0 1.1-.3 1.94-.9 2.52-.6.6-1.5 1-2.75 1-1.2 0-2.1-.34-2.73-1-.62-.68-.93-1.6-.93-2.75v-.62zm3.8 2.3c.36-.3.54-.78.54-1.42v-.58c0-.64-.18-1.12-.54-1.42-.36-.3-.83-.46-1.4-.46-.57 0-1.04.15-1.4.46-.36.3-.54.78-.54 1.42v.58c0 .64.18 1.12.54 1.42.36.3.83-.46 1.4.46.57 0 1.04-.15 1.4-.46zM15.42 6.4c0-1.2.4-2.1 1.18-2.7.78-.6 1.8-.9 3.06-.9 1.1 0 2 .26 2.7.78.7.5.95 1.1.95 1.8v.26h-2.1v-.3c0-.4-.1-.7-.32-.9-.2-.2-.5-.3-.9-.3-.56 0-1 .2-1.3.6-.3.4-.46.9-.46 1.5v.6c0 .6.16 1.1.46 1.5.3.4.74.6 1.3.6.4 0 .7-.1.9-.3.2-.2.32-.5.32-.9v-.3h2.1v.26c0 .7-.24 1.3-.95 1.82-.7.5-1.6.78-2.7.78-1.28 0-2.3-.3-3.07-.9-.78-.6-1.17-1.5-1.17-2.7v-.6zm10.74 2.22c.5 0 .9-.1 1.2-.3l.36 1.86c-.5.26-1.07.4-1.7.4-1.1 0-1.9-.3-2.4-.9-.5-.6-.76-1.4-.76-2.5v-.6c0-1.1.25-1.9.76-2.5.5-.6 1.3-.9 2.4-.9.6 0 1.1.1 1.6.4l-.36 1.8c-.3-.1-.7-.2-1.1-.2-.5 0-.9.2-1.1.5-.2.3-.3.7-.3 1.2v.8c0 .5.1.9.3 1.2.2.3.6.5 1.1.5zM35.6 10.4V3.6h2.16v6.8h-2.16zm2.4 0V3.6h2.2v1.8h.1c.3-.6.8-1 1.4-1.2.6-.2 1.3-.3 2-.3.4 0 .8.1 1.1.2l-.3 2c-.2-.1-.5-.1-.8-.1-.7 0-1.3.2-1.7.5-.4.3-.7.8-1 1.3v2.4h-2.2z" fill="#5F6368"/><path d="M9.4 12.38c.6.3 1.3.46 2.1.46 1.2 0 2.1-.34 2.74-1 .62-.68.93-1.6.93-2.76v-.6c0-1.06-.3-1.82-.92-2.32-.6-.5-1.5-.76-2.6-.76-1.3 0-2.3.3-3.05.9-.75.6-1.12 1.5-1.12 2.7v.6c0 1.1.4 1.9 1.15 2.52z" fill="#EA4335"/><path d="M47.2 6.5c0-.9.3-1.6.8-2.1.5-.5 1.2-.8 2-.8 1 0 1.7.3 2.2.8.5.5.8 1.2.8 2.1v6.8h-2.2V6.5c0-.4-.1-.7-.3-.9-.2-.2-.5-.3-.9-.3-.4 0-.7.1-.9.3-.2.2-.3.5-.3.9v6.8h-2.2V6.5z" fill="#5F6368"/>
  </svg>
);
const VisaIcon = () => (
  <svg width="40" height="16" viewBox="0 0 38 14" xmlns="http://www.w3.org/2000/svg">
    <path d="M35 0H3C1.3 0 0 1.3 0 3v8c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z" fill="#142688"/>
    <path d="M26.4 8.8l-3.2 4.4H20l3.4-4.5c.3-.4.5-.6.6-.9.2-.3.2-.5.2-.8s-.1-.5-.3-.6c-.2-.2-.5-.3-.9-.3-.6 0-1.1.1-1.7.4l-.3-1.8c.7-.2 1.5-.3 2.4-.3.9 0 1.6.2 2.1.5.5.4.8.9.8 1.5 0 .5-.1 1-.4 1.5l-3.1 4.3h2.1l3.2-4.4zM16.1 4.7c-.5-1-.9-1.5-2.2-1.5-.7 0-1.3.3-1.7.9-.4.6-.6 1.3-.6 2.2 0 .8.2 1.5.6 2.1.4.6 1 .9 1.7.9.6 0 1.1-.2 1.4-.6.3-.4.5-.9.5-1.5H18c0 .7-.2 1.3-.6 1.7-.4.4-1 .6-1.7.6-.9 0-1.7-.3-2.2-.9-.5-.6-.8-1.4-.8-2.3s.3-1.8.8-2.4c.5-.6 1.2-.9 2.2-.9.7 0 1.3.3 1.8.8l.5-1.5zM11.6 11.2l-1.9-6.8h2.3l1.1 4.3c.1.4.2.7.3 1.1h.1c.1-.4.2-.7.3-1.1l1.1-4.3h2.2L15.3 11.2h-2.2l-.3-1.3H14l-.2 1.3h-2.2zM8.3 4.6l-1.3 5.3-.2 1.3H4.6l.2-1.3L5.4 4.6h2.9zm.6 6.6H7.1L5.8 3.2h2.2l-1.3 5.4L8.9 11.2z" fill="#fff"/>
  </svg>
);
const MastercardIcon = () => (
  <svg width="40" height="16" viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#EA001B"/>
    <circle cx="26" cy="12" r="12" fill="#F79E1B"/>
    <path d="M22.8 12c0-3.2-2.1-5.9-5-7.3-3.6 1-6.3 4-6.3 7.6 0 3.6 2.7 6.6 6.3 7.6 2.9-1.4 5-4.1 5-7.3z" fill="#FF5F00"/>
  </svg>
);


// --- Footer Logo ---
const FooterLogo = () => (
  <div className="flex items-center shrink-0">
    <a href="/" className="flex items-center space-x-2">
      {/* This is the real code. UNCOMMENT it when your logo path is correct.
        <img src={flipcashLogo} alt="Flipcash Logo" className="w-10 h-10" /> 
      */}
      
      {/* --- Placeholder --- */}
      <img 
        src={flipcashLogo} 
        alt="Flipcash Logo" 
        className="w-34 h-16 rounded-lg" 
      />
      {/* --- End Placeholder --- */}
      
      {/* <span className="font-extrabold text-2xl tracking-tight text-black">FLIPCASH</span> */}
    </a>
    {/* <p className="text-xs text-black/80 font-medium ml-2 mt-2 hidden lg:block" style={{ lineHeight: 1.2, fontSize: '0.65rem' }}>
      SELL AND BUY<br />OLD DEVICES
    </p> */}
  </div>
);

// --- Individual Link Components ---
const FooterLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <li>
    <a href={href} className="text-gray-400 hover:text-white transition-colors duration-200">
      {children}
    </a>
  </li>
);

const ContactItem: React.FC<{ icon: React.ReactNode; children: React.ReactNode }> = ({ icon, children }) => (
  <div className="flex items-start gap-3">
    <span className="text-yellow-400 mt-1">{icon}</span>
    <span className="text-gray-400">{children}</span>
  </div>
);


// --- Main Footer Component ---
const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white">
      {/* Top Yellow Bar */}
      <div className="bg-[#ffe208] text-black">
        <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between">
          <FooterLogo />
          <div className="flex items-center gap-5 mt-4 md:mt-0">
            <a href="#" aria-label="Facebook" className="hover:text-black/70 transition-colors">
              <Facebook size={24} />
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-black/70 transition-colors">
              <Instagram size={24} />
            </a>
            <a href="#" aria-label="LinkedIn" className="hover:text-black/70 transition-colors">
              <Linkedin size={24} />
            </a>
            <a href="#" aria-label="X" className="hover:text-black/70 transition-colors">
              <XIcon />
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Section 1: About */}
          <div className="md:col-span-2 lg:col-span-1">
            <h3 className="text-lg font-semibold mb-4">About Flipcash</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Flipcash is your trusted partner to sell old devices and buy refurbished ones. We believe in providing a seamless experience, fair pricing, and contributing to a sustainable future by extending the life of electronics.
            </p>
          </div>

          {/* Section 2: Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <FooterLink href="#">Mobile</FooterLink>
              <FooterLink href="#">Laptop</FooterLink>
              <FooterLink href="#">Tablet</FooterLink>
              <FooterLink href="#">Smart Watch</FooterLink>
            </ul>
          </div>

          {/* Section 3: Important Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Important Links</h3>
            {/* Split into two columns for better layout */}
            <div className="flex gap-8 text-sm">
              <ul className="space-y-3">
                <FooterLink href="#">About Us</FooterLink>
                <FooterLink href="#">Career</FooterLink>
                <FooterLink href="#">Blog</FooterLink>
                <FooterLink href="#">Become Partner</FooterLink>
                <FooterLink href="#">Contact Us</FooterLink>
              </ul>
              <ul className="space-y-3">
                <FooterLink href="#">Refund Policy</FooterLink>
                <FooterLink href="#">Terms & Conditions</FooterLink>
                <FooterLink href="#">Privacy Policy</FooterLink>
                <FooterLink href="#">Terms of Use</FooterLink>
                <FooterLink href="#">Cookies Policy</FooterLink>
              </ul>
            </div>
          </div>

          {/* Section 4: Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-4 text-sm">
              <ContactItem icon={<MapPin size={20} />}>
                123 Flipcash Tower, Tech Park,
                New Delhi, 110001, India
              </ContactItem>
              <ContactItem icon={<Mail size={20} />}>
                support@flipcash.com
              </ContactItem>
              <ContactItem icon={<Phone size={20} />}>
                (64) 8342 1245
              </ContactItem>
              <a href="#" className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 font-semibold transition-colors">
                Get direction <ArrowRight size={16} />
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
          <p className="text-center md:text-left mb-4 md:mb-0">
            Copyright © 2025 by <span className="text-white font-semibold">FLIPCASH</span>. All Rights Reserved.
          </p>
          {/* <div className="flex items-center gap-4">
            <GPayIcon />
            <VisaIcon />
            <MastercardIcon />
          </div> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;

