import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, MapPin, Mail, Phone, ArrowRight, Youtube } from 'lucide-react';
import flipcashLogo from '../../../public/flipcash_header_logo.png'

// --- Custom X Icon ---
const XIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932L18.901 1.153Zm-1.16 19.5h1.85l-10.5-12.03L3.18 3.05H1.33l10.8 12.35 6.01 5.303Z"/>
  </svg>
);

// // --- Custom Pinterest Icon ---
// const PinterestIcon = () => (
//   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//     <path d="M12 2C6.477 2 2 6.477 2 12c0 4.237 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.181-.78 1.172-4.97 1.172-4.97s-.299-.6-.299-1.486c0-1.39.806-2.428 1.81-2.428.852 0 1.264.64 1.264 1.408 0 .858-.545 2.14-.828 3.33-.236.995.5 1.807 1.48 1.807 1.778 0 3.144-1.874 3.144-4.58 0-2.393-1.72-4.068-4.177-4.068-2.845 0-4.515 2.135-4.515 4.34 0 .859.331 1.781.745 2.281a.3.3 0 01.069.288l-.278 1.133c-.044.183-.145.223-.335.134-1.249-.581-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.965-.525-2.291-1.148l-.623 2.378c-.226.869-.835 1.958-1.244 2.621.937.29 1.931.446 2.962.446 5.523 0 10-4.477 10-10S17.523 2 12 2z" fill="currentColor"/>
//   </svg>
// );

// // --- Custom Threads Icon ---
// const ThreadsIcon = () => (
//   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//     <path d="M16.25 8.5c-.69-2.69-2.66-4.5-5.25-4.5-3.17 0-5.75 2.58-5.75 5.75v4.5C5.25 17.42 7.83 20 11 20c2.59 0 4.56-1.81 5.25-4.5M12 8.5c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3M8.5 11.5c0-1.93 1.57-3.5 3.5-3.5s3.5 1.57 3.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//   </svg>
// );

// // --- Custom WhatsApp Icon ---
// const WhatsAppIcon = () => (
//   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//     <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" fill="currentColor"/>
//   </svg>
// );

// --- Footer Logo ---
const FooterLogo: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <div className="flex items-center shrink-0">
    <button onClick={onClick} className="flex items-center space-x-2">
      <img 
        src={flipcashLogo} 
        alt="Flipcash Logo" 
        className="w-34 h-16 rounded-lg" 
      />
    </button>
  </div>
);

// --- Individual Link Components ---
const FooterLink: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
  <li>
    <button onClick={onClick} className="text-gray-400 hover:text-white transition-colors duration-200">
      {children}
    </button>
  </li>
);

const ContactItem: React.FC<{ icon: React.ReactNode; children: React.ReactNode; href?: string }> = ({ icon, children, href }) => (
  <div className="flex items-start gap-3">
    <span className="text-yellow-400 mt-1">{icon}</span>
    {href ? (
      <a href={href} className="text-gray-400 hover:text-white transition-colors">
        {children}
      </a>
    ) : (
      <span className="text-gray-400">{children}</span>
    )}
  </div>
);

// --- Main Footer Component ---
const Footer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-black text-white">
      {/* Top Yellow Bar */}
      <div className="bg-[#FEC925] text-black">
        <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <FooterLogo onClick={() => navigate('/')} />
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <a 
              href="https://www.facebook.com/profile.php?id=61583147654420" 
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook" 
              className="hover:text-black/70 transition-colors"
            >
              <Facebook size={24} />
            </a>
            <a 
              href="https://www.instagram.com/flipcash.official/?hl=en" 
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram" 
              className="hover:text-black/70 transition-colors"
            >
              <Instagram size={24} />
            </a>
            <a 
              href="https://www.linkedin.com/company/flipcash-private-limited/about/?viewAsMember=true" 
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn" 
              className="hover:text-black/70 transition-colors"
            >
              <Linkedin size={24} />
            </a>
            <a 
              href="https://x.com/flipcashindia" 
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter)" 
              className="hover:text-black/70 transition-colors"
            >
              <XIcon />
            </a>
            <a 
              href="https://www.youtube.com/@flipcash.official" 
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube" 
              className="hover:text-black/70 transition-colors"
            >
              <Youtube size={24} />
            </a>
            {/* <a 
              href="https://www.threads.net/@flipcash.official" 
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Threads" 
              className="hover:text-black/70 transition-colors"
            >
              <ThreadsIcon />
            </a>
            <a 
              href="https://www.pinterest.com/flipcashindia" 
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Pinterest" 
              className="hover:text-black/70 transition-colors"
            >
              <PinterestIcon />
            </a>
            <a 
              href="https://wa.me/919654786218" 
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp Business" 
              className="hover:text-black/70 transition-colors"
            >
              <WhatsAppIcon />
            </a> */}
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
              Flipcash is India's trusted re-commerce platform that helps users sell their old gadgets instantly. 
              We believe in providing a seamless experience with 100% secure transactions, instant payments, 
              and doorstep pickup while contributing to a sustainable future by reducing e-waste.
            </p>
          </div>

          {/* Section 2: Quick Links */}
          {/* <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <FooterLink onClick={() => navigate('/mobile')}>Mobile</FooterLink>
              <FooterLink onClick={() => navigate('/laptop')}>Laptop</FooterLink>
              <FooterLink onClick={() => navigate('/tablet')}>Tablet</FooterLink>
              <FooterLink onClick={() => navigate('/smartwatch')}>Smart Watch</FooterLink>
            </ul>
          </div> */}

          {/* Section 3: Important Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Important Links</h3>
            <div className="flex gap-8 text-sm">
              <ul className="space-y-3">
                <FooterLink onClick={() => navigate('/about')}>About Us</FooterLink>
                <FooterLink onClick={() => navigate('/career')}>Career</FooterLink>
                <FooterLink onClick={() => navigate('/blog')}>Blog</FooterLink>
                <FooterLink onClick={() => navigate('/partner')}>Become Partner</FooterLink>
                <FooterLink onClick={() => navigate('/contact')}>Contact Us</FooterLink>
              </ul>
              <ul className="space-y-3">
                <FooterLink onClick={() => navigate('/refund-policy')}>Refund Policy</FooterLink>
                <FooterLink onClick={() => navigate('/terms')}>Terms & Conditions</FooterLink>
                <FooterLink onClick={() => navigate('/privacy')}>Privacy Policy</FooterLink>
                <FooterLink onClick={() => navigate('/terms-of-use')}>Terms of Use</FooterLink>
                <FooterLink onClick={() => navigate('/cookies')}>Cookies Policy</FooterLink>
              </ul>
            </div>
          </div>

          {/* Section 4: Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-4 text-sm">
              <ContactItem icon={<MapPin size={20} />}>
                7th Floor, Unit No. 703, Palm Court,<br />
                Mehrauli Gurgaon Road, Sukhrali Chowk,<br />
                Sector 16, Gurugram, Haryana - 122007
              </ContactItem>
              <ContactItem 
                icon={<Mail size={20} />}
                href="mailto:info@flipcash.in"
              >
                info@flipcash.in
              </ContactItem>
              <ContactItem 
                icon={<Phone size={20} />}
                href="tel:+919654786218"
              >
                +91 9654 786 218
              </ContactItem>
              <a 
                href="https://maps.google.com/?q=7th+Floor,+Unit+No.+703,+Palm+Court,+Mehrauli+Gurgaon+Road,+Sukhrali+Chowk,+Sector+16,+Gurugram,+Haryana+122007" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 font-semibold transition-colors"
              >
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
            Copyright © 2025 by <span className="text-white font-semibold">Flipcash Private Limited</span>. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;