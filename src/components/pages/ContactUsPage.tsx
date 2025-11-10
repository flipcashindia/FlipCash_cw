import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Mail, CheckCircle, AlertTriangle, X } from 'lucide-react';

// --- Reusable Form Input ---
const FormInput: React.FC<{
  label: string, 
  id: string, 
  type?: string,
  value: string, 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  required?: boolean,
  placeholder?: string
}> = ({ label, id, type = 'text', value, onChange, required = true, placeholder }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
      required={required}
    />
  </div>
);

// --- Reusable Textarea ---
const FormTextarea: React.FC<{
  label: string,
  id: string,
  value: string,
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void,
  placeholder?: string,
  required?: boolean
}> = ({ label, id, value, onChange, placeholder, required = true }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      rows={5}
      className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
      placeholder={placeholder}
      required={required}
    />
  </div>
);

// --- Form Response Alert ---
const FormAlert: React.FC<{
  type: 'success' | 'error';
  title: string;
  message: string;
  onClose: () => void;
}> = ({ type, title, message, onClose }) => {
  const Icon = type === 'success' ? CheckCircle : AlertTriangle;
  const colors = type === 'success' 
    ? 'bg-green-50 border-green-300 text-green-800'
    : 'bg-red-50 border-red-300 text-red-800';

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`relative border ${colors} p-4 rounded-lg`}
    >
      <button 
        onClick={onClose} 
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        aria-label="Close"
      >
        <X size={18} />
      </button>
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon size={20} className="mt-0.5" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-bold">{title}</h3>
          <p className="text-sm mt-1">{message}</p>
        </div>
      </div>
    </motion.div>
  );
};

// --- Contact Info Block ---
const InfoBlock: React.FC<{ icon: React.ReactNode, title: string, children: React.ReactNode }> = ({ icon, title, children }) => (
  <div className="flex items-start gap-4">
    <div className="flex-shrink-0 w-12 h-12 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center">
      {icon}
    </div>
    <div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <div className="text-gray-600">{children}</div>
    </div>
  </div>
);

// --- Main Contact Us Page Component ---
const ContactUsPage: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [formResponse, setFormResponse] = useState<{
    type: 'success' | 'error';
    title: string;
    message: string;
  } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    console.log("Submitting contact form:", formData);
    
    // Show success message
    setFormResponse({
      type: 'success',
      title: 'Message Sent!',
      message: "Thank you for contacting us. We'll get back to you as soon as possible."
    });
    
    // Clear form
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  return (
    <section className="bg-white">
      {/* Page Header Banner */}
      <div 
        className="py-16 md:py-20" 
        style={{ background: 'linear-gradient(to right, #fff7e0, #ffe8cc)' }}
      >
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Contact Us
          </h1>
          <div className="flex justify-center items-center text-sm text-gray-600">
            <a href="/" className="hover:text-red-600 transition-colors">Home</a>
            <span className="mx-2">»</span>
            <span>Contact</span>
          </div>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="container mx-auto px-4 md:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left: Contact Form */}
          <div className="bg-white p-6 md:p-8 border rounded-2xl shadow-lg">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Send us a Message
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence>
                {formResponse && (
                  <FormAlert 
                    {...formResponse} 
                    onClose={() => setFormResponse(null)} 
                  />
                )}
              </AnimatePresence>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput 
                  label="First Name"
                  id="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                />
                <FormInput 
                  label="Last Name"
                  id="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                />
              </div>
              <FormInput 
                label="Email"
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john.doe@example.com"
              />
              <FormInput 
                label="Phone Number"
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                required={false}
              />
              <FormInput 
                label="Subject"
                id="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Question about an order"
              />
              <FormTextarea
                label="Your Message"
                id="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Type your message here..."
              />

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full px-8 py-4 bg-teal-600 text-white text-lg font-semibold rounded-lg hover:bg-teal-700 transition-colors shadow-md"
                >
                  Submit Message
                </button>
              </div>
            </form>
          </div>

          {/* Right: Contact Details & Map */}
          <div className="space-y-8">
            <div className="bg-white p-6 md:p-8 border rounded-2xl shadow-lg">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Get in Touch
              </h2>
              <div className="space-y-6">
                <InfoBlock icon={<MapPin size={24} />} title="Our Address">
                  <p>123 Flipcash Tower, Tech Park,<br />New Delhi, 110001, India</p>
                </InfoBlock>
                <InfoBlock icon={<Phone size={24} />} title="Call Us">
                  <p>(64) 8342 1245</p>
                </InfoBlock>
                <InfoBlock icon={<Mail size={24} />} title="Email Us">
                  <p>support@flipcash.com</p>
                </InfoBlock>
              </div>
            </div>
            
            {/* Embedded Map */}
            <div className="rounded-2xl shadow-lg overflow-hidden border">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d448196.5262800361!2d76.81307299667618!3d28.64368463562868!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0x52c2b7494e204dce!2sNew%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1730661604085!5m2!1sen!2sin"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Map of New Delhi"
              ></iframe>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactUsPage;
