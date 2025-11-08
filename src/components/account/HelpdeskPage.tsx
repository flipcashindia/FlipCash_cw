import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, Phone, Mail, MessageCircle, Search } from 'lucide-react';
import type { MenuTab } from './MyAccountPage';

interface HelpdeskPageProps {
  onNavClick: (tab: MenuTab) => void;
  onLogout: () => void;
}

const HelpdeskPage: React.FC<HelpdeskPageProps> = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    {
      question: 'How do I sell my device?',
      answer: 'Select your device category, brand, and model. Answer questions about its condition to get an instant quote. Schedule a pickup and get paid once verified.',
    },
    {
      question: 'When will I receive payment?',
      answer: 'Payment is processed within 24-48 hours after device verification. Funds are added to your FlipCash wallet.',
    },
    {
      question: 'What condition should my device be in?',
      answer: 'We accept devices in all conditions - working, non-working, broken screen, etc. Price varies based on condition.',
    },
    {
      question: 'How do I withdraw money from wallet?',
      answer: 'Go to My Wallet, choose UPI or Bank Transfer, enter amount and account details, then submit withdrawal request.',
    },
    {
      question: 'Can I cancel my order?',
      answer: 'Yes, you can cancel before the pickup agent arrives. Go to My Orders and click Cancel.',
    },
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-8">
            <HelpCircle size={32} className="text-teal-600" />
            <h1 className="text-3xl font-bold text-gray-900">Help & Support</h1>
          </div>

          <div className="relative mb-8">
            <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for help..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {filteredFaqs.map((faq, index) => (
                <details key={index} className="bg-gray-50 p-4 rounded-lg">
                  <summary className="font-semibold text-gray-900 cursor-pointer">{faq.question}</summary>
                  <p className="mt-2 text-gray-700">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-6 rounded-lg text-center">
              <Phone size={32} className="mx-auto mb-3 text-blue-600" />
              <h3 className="font-semibold text-gray-900 mb-2">Call Us</h3>
              <p className="text-sm text-gray-600">1800-123-4567</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg text-center">
              <Mail size={32} className="mx-auto mb-3 text-green-600" />
              <h3 className="font-semibold text-gray-900 mb-2">Email Us</h3>
              <p className="text-sm text-gray-600">support@flipcash.com</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg text-center">
              <MessageCircle size={32} className="mx-auto mb-3 text-purple-600" />
              <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
              <button className="text-sm text-purple-600 font-semibold hover:underline">Start Chat</button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HelpdeskPage;