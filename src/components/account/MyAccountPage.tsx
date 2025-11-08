import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, ShoppingBag, Wallet, MapPin, User, HelpCircle, Flag, MessageSquare, LogOut } from 'lucide-react';

export type MenuTab = 'Dashboard' | 'My Orders' | 'My Wallet'| 'Addresses' | 'Account Details' | 'Helpdesk' | 'Raise Dispute' | 'Feedback';

interface MyAccountPageProps {
  username?: string;
  onNavClick: (tab: MenuTab | 'Passbook') => void;
  onBreadcrumbClick: (path: string) => void;
  onLogout: () => void;
}

const MyAccountPage: React.FC<MyAccountPageProps> = ({ username, onNavClick, onLogout }) => {
  const { user, isAuthenticated } = useAuth();
  const displayName = user?.full_name || username || 'User';

  const menuItems = [
    { id: 'My Orders' as MenuTab, label: 'My Orders', icon: ShoppingBag, color: 'text-blue-600' },
    { id: 'My Wallet' as MenuTab, label: 'My Wallet', icon: Wallet, color: 'text-green-600' },
    { id: 'Addresses' as MenuTab, label: 'Addresses', icon: MapPin, color: 'text-red-600' },
    { id: 'Account Details' as MenuTab, label: 'Account Details', icon: User, color: 'text-purple-600' },
    { id: 'Helpdesk' as MenuTab, label: 'Helpdesk', icon: HelpCircle, color: 'text-orange-600' },
    { id: 'Raise Dispute' as MenuTab, label: 'Raise Dispute', icon: Flag, color: 'text-pink-600' },
    { id: 'Feedback' as MenuTab, label: 'Feedback', icon: MessageSquare, color: 'text-teal-600' },
  ];

  return (
    <section className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-8 pb-6 border-b">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {displayName[0].toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
                <p className="text-gray-600">Welcome back, {displayName}!</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => onNavClick(item.id)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-4 p-6 bg-gray-50 hover:bg-gray-100 rounded-xl border-2 border-transparent hover:border-teal-500 transition-all"
              >
                <div className={`p-3 bg-white rounded-lg ${item.color}`}>
                  <item.icon size={24} />
                </div>
                <span className="text-lg font-semibold text-gray-900">{item.label}</span>
              </motion.button>
            ))}
          </div>

          {isAuthenticated && user && (
            <div className="mt-8 pt-6 border-t">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Profile Completion</p>
                  <p className="text-2xl font-bold text-blue-600">{user.profile_completion_percentage}%</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Account Status</p>
                  <p className="text-2xl font-bold text-green-600">{user.is_active ? 'Active' : 'Inactive'}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Phone Verified</p>
                  <p className="text-2xl font-bold text-purple-600">{user.is_phone_verified ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default MyAccountPage;