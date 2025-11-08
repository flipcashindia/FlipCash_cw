import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Flag, Upload } from 'lucide-react';
import type { MenuTab } from './MyAccountPage';

interface RaiseDisputePageProps {
  onNavClick: (tab: MenuTab) => void;
  onLogout: () => void;
}

const RaiseDisputePage: React.FC<RaiseDisputePageProps> = () => {
  const [orderId, setOrderId] = useState('');
  const [disputeType, setDisputeType] = useState('');
  const [description, setDescription] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const disputeTypes = [
    'Incorrect Price Quote',
    'Device Not Picked Up',
    'Payment Issue',
    'Device Damage During Pickup',
    'Verification Issue',
    'Other',
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert('Dispute raised successfully! Our team will review it shortly.');
      setOrderId('');
      setDisputeType('');
      setDescription('');
      setAttachments([]);
    } catch (error) {
      alert('Failed to submit dispute');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-8">
            <Flag size={32} className="text-red-600" />
            <h1 className="text-3xl font-bold text-gray-900">Raise a Dispute</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Order ID</label>
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Enter your order ID"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Dispute Type</label>
              <select
                value={disputeType}
                onChange={(e) => setDisputeType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              >
                <option value="">Select dispute type</option>
                {disputeTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your issue in detail..."
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Upload size={16} className="inline mr-1" />
                Attachments (Optional)
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                multiple
                accept="image/*,.pdf"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />
              {attachments.length > 0 && (
                <p className="text-sm text-gray-600 mt-2">{attachments.length} file(s) selected</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:bg-gray-400"
            >
              {loading ? 'Submitting...' : 'Submit Dispute'}
            </button>
          </form>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Note:</strong> Our support team will review your dispute within 24-48 hours and contact you via registered phone/email.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default RaiseDisputePage;