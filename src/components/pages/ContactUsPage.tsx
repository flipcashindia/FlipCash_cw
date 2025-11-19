// src/pages/ContactUs.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Mail, CheckCircle, AlertTriangle, X, Clock, Send, MessageCircle, Facebook, Instagram, Linkedin, Youtube, Info } from 'lucide-react';
// import flipcashLogo from '../../../public/flipcash_header_logo.png';
import axios from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

// Local Storage Key
const CONTACT_SUBMISSION_KEY = 'flipcash_contact_submission';

// --- Types ---
interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface ContactResponse {
  success: boolean;
  message: string;
  data?: any;
}

interface StoredSubmission {
  timestamp: number;
  data: ContactFormData;
  expiresAt: number;
}

// --- Helper Functions ---
const getStoredSubmission = (): StoredSubmission | null => {
  try {
    const stored = localStorage.getItem(CONTACT_SUBMISSION_KEY);
    if (!stored) return null;
    
    const submission: StoredSubmission = JSON.parse(stored);
    
    // Check if expired
    if (Date.now() > submission.expiresAt) {
      localStorage.removeItem(CONTACT_SUBMISSION_KEY);
      return null;
    }
    
    return submission;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
};

const storeSubmission = (data: ContactFormData): void => {
  try {
    const ONE_HOUR = 60 * 60 * 1000; // 1 hour in milliseconds
    const submission: StoredSubmission = {
      timestamp: Date.now(),
      data: data,
      expiresAt: Date.now() + ONE_HOUR,
    };
    localStorage.setItem(CONTACT_SUBMISSION_KEY, JSON.stringify(submission));
  } catch (error) {
    console.error('Error writing to localStorage:', error);
  }
};

const clearStoredSubmission = (): void => {
  localStorage.removeItem(CONTACT_SUBMISSION_KEY);
};

const getTimeRemaining = (expiresAt: number): string => {
  const remaining = expiresAt - Date.now();
  if (remaining <= 0) return '0 minutes';
  
  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  
  if (minutes > 0) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ${seconds} second${seconds !== 1 ? 's' : ''}`;
  }
  return `${seconds} second${seconds !== 1 ? 's' : ''}`;
};

// API Service Function
const submitContactForm = async (data: ContactFormData): Promise<ContactResponse> => {
  try {
    const payload = {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone: data.phone || null,
      subject: data.subject,
      message: data.message,
    };
    
    const response = await axios.post(
      `${API_BASE_URL}/contact/submit/`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    return response.data;

  } catch (error: any) {
    if (error.response?.data) {
      const errorData = error.response.data;
      
      if (errorData.first_name || errorData.last_name || errorData.email || 
          errorData.subject || errorData.message || errorData.phone) {
        const errors: string[] = [];
        
        if (errorData.first_name) errors.push(`First Name: ${errorData.first_name[0]}`);
        if (errorData.last_name) errors.push(`Last Name: ${errorData.last_name[0]}`);
        if (errorData.email) errors.push(`Email: ${errorData.email[0]}`);
        if (errorData.phone) errors.push(`Phone: ${errorData.phone[0]}`);
        if (errorData.subject) errors.push(`Subject: ${errorData.subject[0]}`);
        if (errorData.message) errors.push(`Message: ${errorData.message[0]}`);
        
        throw new Error(errors.join('. '));
      }
      
      if (errorData.message) {
        throw new Error(errorData.message);
      }
      
      if (errorData.detail) {
        throw new Error(errorData.detail);
      }
    }
    
    throw new Error('Network error. Please check your connection and try again.');
  }
};

// --- Custom X Icon ---
const XIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932L18.901 1.153Zm-1.16 19.5h1.85l-10.5-12.03L3.18 3.05H1.33l10.8 12.35 6.01 5.303Z"/>
  </svg>
);

// --- Recent Submission Notice ---
const RecentSubmissionNotice: React.FC<{
  submission: StoredSubmission;
  onClear: () => void;
  timeRemaining: string;
}> = ({ submission, timeRemaining }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-blue-50 border-2 border-blue-400 rounded-xl p-6 mb-6"
  >
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0">
        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
          <Info className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-bold text-blue-900 mb-2">
          You recently submitted a message
        </h3>
        <div className="text-sm text-blue-800 space-y-2">
          <p>
            <strong>Subject:</strong> {submission.data.subject}
          </p>
          <p>
            <strong>Submitted:</strong> {new Date(submission.timestamp).toLocaleString()}
          </p>
          {/* <p>
            <strong>Time remaining:</strong> {timeRemaining}
          </p> */}
          <p className="mt-3">
            To prevent spam, you can submit another message in <strong>{timeRemaining}</strong>.
          </p>
        </div>
        {/* <button
          onClick={onClear}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          Clear & Submit New Message
        </button> */}
      </div>
    </div>
  </motion.div>
);

// --- Reusable Form Input ---
const FormInput: React.FC<{
  label: string, 
  id: string, 
  type?: string,
  value: string, 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  required?: boolean,
  placeholder?: string,
  icon?: React.ReactNode,
  error?: string,
  disabled?: boolean
}> = ({ label, id, type = 'text', value, onChange, required = true, placeholder, icon, error, disabled = false }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-semibold text-gray-900 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {icon && (
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`block w-full ${icon ? 'pl-12' : 'pl-4'} pr-4 py-3 border-2 ${error ? 'border-red-500' : 'border-gray-200'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FEC925] focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed`}
        required={required}
      />
    </div>
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

// --- Reusable Textarea ---
const FormTextarea: React.FC<{
  label: string,
  id: string,
  value: string,
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void,
  placeholder?: string,
  required?: boolean,
  error?: string,
  disabled?: boolean
}> = ({ label, id, value, onChange, placeholder, required = true, error, disabled = false }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-semibold text-gray-900 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      rows={5}
      disabled={disabled}
      className={`block w-full px-4 py-3 border-2 ${error ? 'border-red-500' : 'border-gray-200'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FEC925] focus:border-transparent transition-all duration-200 resize-none disabled:bg-gray-100 disabled:cursor-not-allowed`}
      placeholder={placeholder}
      required={required}
      minLength={10}
    />
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    {!disabled && <p className="mt-1 text-xs text-gray-500">{value.length} characters (minimum 10 required)</p>}
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
    ? 'bg-green-50 border-green-400 text-green-800'
    : 'bg-red-50 border-red-400 text-red-800';

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className={`relative border-2 ${colors} p-4 rounded-xl shadow-lg`}
    >
      <button 
        onClick={onClose} 
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition-colors"
        aria-label="Close"
      >
        <X size={18} />
      </button>
      <div className="flex items-start pr-8">
        <div className="flex-shrink-0">
          <Icon size={24} className="mt-0.5" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-bold">{title}</h3>
          <p className="text-sm mt-1 whitespace-pre-line">{message}</p>
        </div>
      </div>
    </motion.div>
  );
};

// --- Contact Info Card ---
const ContactCard: React.FC<{ 
  icon: React.ReactNode, 
  title: string, 
  children: React.ReactNode,
  href?: string,
  delay?: number
}> = ({ icon, title, children, href, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-[#FEC925] group"
  >
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-[#FEC925] to-yellow-400 text-black rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        {href ? (
          <a href={href} className="text-gray-600 hover:text-[#FEC925] transition-colors">
            {children}
          </a>
        ) : (
          <div className="text-gray-600">{children}</div>
        )}
      </div>
    </div>
  </motion.div>
);

// --- Main Contact Us Page Component ---
const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [formErrors, setFormErrors] = useState<Partial<ContactFormData>>({});
  const [formResponse, setFormResponse] = useState<{
    type: 'success' | 'error';
    title: string;
    message: string;
  } | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentSubmission, setRecentSubmission] = useState<StoredSubmission | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  // Check for recent submission on mount and set up timer
  useEffect(() => {
    const checkSubmission = () => {
      const stored = getStoredSubmission();
      setRecentSubmission(stored);
      
      if (stored) {
        setTimeRemaining(getTimeRemaining(stored.expiresAt));
      }
    };

    // Initial check
    checkSubmission();

    // Update every second
    const interval = setInterval(checkSubmission, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name as keyof ContactFormData]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleClearRecentSubmission = () => {
    clearStoredSubmission();
    setRecentSubmission(null);
    setTimeRemaining('');
  };

  const validateForm = (): boolean => {
    const errors: Partial<ContactFormData> = {};
    
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }
    
    if (!formData.subject.trim()) {
      errors.subject = 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters long';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setFormResponse(null);
    
    if (!validateForm()) {
      setFormResponse({
        type: 'error',
        title: 'Validation Error',
        message: 'Please fix the errors in the form before submitting.'
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await submitContactForm(formData);
      
      // Store submission in localStorage
      storeSubmission(formData);
      setRecentSubmission(getStoredSubmission());
      
      setFormResponse({
        type: 'success',
        title: 'Message Sent Successfully!',
        message: response.message || "Thank you for contacting Flipcash. We'll get back to you within 24-48 hours."
      });
      
      // Clear form on success
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setFormErrors({});
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => setFormResponse(null), 5000);
      
    } catch (error: any) {
      setFormResponse({
        type: 'error',
        title: 'Submission Failed',
        message: error.message || 'Something went wrong. Please try again later.'
      });
      
      setTimeout(() => setFormResponse(null), 8000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormDisabled = recentSubmission !== null;

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#FEC925] to-yellow-400 py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-black rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
          {/* <motion.img
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            src={flipcashLogo} 
            alt="Flipcash Logo" 
            className="w-48 h-24 mx-auto mb-8 rounded-lg" 
          /> */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-extrabold text-black mb-4"
          >
            Get In Touch
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl text-black/80 max-w-3xl mx-auto font-medium"
          >
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </motion.p>
        </div>
      </section>

      {/* Quick Contact Bar */}
      <section className="py-6 bg-black">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-wrap justify-center items-center gap-8 text-white">
            <a href="tel:+919654786218" className="flex items-center gap-2 hover:text-[#FEC925] transition-colors">
              <Phone className="w-5 h-5" />
              <span className="font-semibold">+91 96547 86218</span>
            </a>
            <span className="hidden md:block text-gray-600">|</span>
            <a href="mailto:support@flipcash.in" className="flex items-center gap-2 hover:text-[#FEC925] transition-colors">
              <Mail className="w-5 h-5" />
              <span className="font-semibold">support@flipcash.in</span>
            </a>
            <span className="hidden md:block text-gray-600">|</span>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span className="font-semibold">Mon-Sat: 10 AM - 7 PM</span>
            </div>
          </div>
        </div>
      </section>
      
      {/* Main Content Area */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
            
            {/* Left: Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white p-8 md:p-10 border-2 border-gray-100 rounded-2xl shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-[#FEC925] rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-black" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Send Message
                </h2>
              </div>
              
              {/* Recent Submission Notice */}
              {recentSubmission && (
                <RecentSubmissionNotice
                  submission={recentSubmission}
                  onClear={handleClearRecentSubmission}
                  timeRemaining={timeRemaining}
                />
              )}
              
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
                    error={formErrors.firstName}
                    disabled={isFormDisabled}
                  />
                  <FormInput 
                    label="Last Name"
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    error={formErrors.lastName}
                    disabled={isFormDisabled}
                  />
                </div>
                
                <FormInput 
                  label="Email Address"
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john.doe@example.com"
                  icon={<Mail className="w-5 h-5" />}
                  error={formErrors.email}
                  disabled={isFormDisabled}
                />
                
                <FormInput 
                  label="Phone Number"
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  required={false}
                  icon={<Phone className="w-5 h-5" />}
                  error={formErrors.phone}
                  disabled={isFormDisabled}
                />
                
                <FormInput 
                  label="Subject"
                  id="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  error={formErrors.subject}
                  disabled={isFormDisabled}
                />
                
                <FormTextarea
                  label="Your Message"
                  id="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us more about your inquiry... (minimum 10 characters)"
                  error={formErrors.message}
                  disabled={isFormDisabled}
                />

                <motion.button
                  whileHover={!isFormDisabled ? { scale: 1.02 } : {}}
                  whileTap={!isFormDisabled ? { scale: 0.98 } : {}}
                  type="submit"
                  disabled={isSubmitting || isFormDisabled}
                  className="w-full px-8 py-4 bg-gradient-to-r from-[#FEC925] to-yellow-400 text-black text-lg font-bold rounded-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : isFormDisabled ? (
                    <>
                      <Clock className="w-5 h-5" />
                      Form Locked - Wait {timeRemaining}
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>

            {/* Right: Contact Details & Map */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-[#FEC925] rounded-xl flex items-center justify-center">
                    <Phone className="w-6 h-6 text-black" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                    Contact Info
                  </h2>
                </div>
                
                <div className="space-y-4">
                  <ContactCard 
                    icon={<MapPin size={24} />} 
                    title="Our Office"
                    delay={0.1}
                  >
                    <p className="text-sm leading-relaxed">
                      7th Floor, Unit No. 703, Palm Court,<br />
                      Mehrauli Gurgaon Road, Sukhrali Chowk,<br />
                      Sector 16, Gurugram, Haryana – 122007
                    </p>
                  </ContactCard>
                  
                  <ContactCard 
                    icon={<Phone size={24} />} 
                    title="Call Us"
                    href="tel:+919654786218"
                    delay={0.2}
                  >
                    <p className="font-semibold">+91 96547 86218</p>
                    <p className="font-semibold">+91 91232 28577</p>
                  </ContactCard>
                  
                  <ContactCard 
                    icon={<Mail size={24} />} 
                    title="Email Us"
                    href="mailto:support@flipcash.in"
                    delay={0.3}
                  >
                    <p className="font-semibold">support@flipcash.in</p>
                    <p className="text-sm">info@flipcash.in</p>
                  </ContactCard>
                  
                  <ContactCard 
                    icon={<Clock size={24} />} 
                    title="Working Hours"
                    delay={0.4}
                  >
                    <p className="font-semibold">Monday - Saturday</p>
                    <p className="text-sm">10:00 AM - 7:00 PM IST</p>
                    <p className="text-sm text-red-600 mt-1">Sunday: Closed</p>
                  </ContactCard>
                </div>
              </motion.div>
              
              {/* Social Media */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 shadow-2xl"
              >
                <h3 className="text-2xl font-bold text-white mb-6">Follow Us</h3>
                <div className="flex flex-wrap gap-4">
                  <a 
                    href="https://www.facebook.com/profile.php?id=61583147654420"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-white/10 hover:bg-[#FEC925] text-white hover:text-black rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
                  >
                    <Facebook size={24} />
                  </a>
                  <a 
                    href="https://www.instagram.com/flipcash.official/?hl=en"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-white/10 hover:bg-[#FEC925] text-white hover:text-black rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
                  >
                    <Instagram size={24} />
                  </a>
                  <a 
                    href="https://www.linkedin.com/company/flipcash-private-limited/about/?viewAsMember=true"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-white/10 hover:bg-[#FEC925] text-white hover:text-black rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
                  >
                    <Linkedin size={24} />
                  </a>
                  <a 
                    href="https://x.com/flipcashindia"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-white/10 hover:bg-[#FEC925] text-white hover:text-black rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
                  >
                    <XIcon />
                  </a>
                  <a 
                    href="https://www.youtube.com/@flipcash.official"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-white/10 hover:bg-[#FEC925] text-white hover:text-black rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
                  >
                    <Youtube size={24} />
                  </a>
                </div>
              </motion.div>
              
              {/* Embedded Map */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="rounded-2xl shadow-2xl overflow-hidden border-2 border-gray-100"
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3508.272464788895!2d77.03739207549658!3d28.445944075756677!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d18e4e39a4ed5%3A0x8b4d8c6e7ad9e8f5!2sPalm%20Court%2C%20Mehrauli%20-%20Gurgaon%20Rd%2C%20Sukhrali%2C%20Gurugram%2C%20Haryana%20122001!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Flipcash Office Location - Gurugram"
                ></iframe>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ Quick Links */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Looking for Quick Answers?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Check out our FAQ section for instant solutions
          </p>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="/faq"
            className="inline-block bg-gradient-to-r from-[#FEC925] to-yellow-400 text-black px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            Visit FAQ Section
          </motion.a>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;