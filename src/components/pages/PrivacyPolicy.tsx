// src/pages/PrivacyPolicy.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Eye, Database, Users, Bell, Cookie, Scale, Mail, Phone, MapPin } from 'lucide-react';
// import flipcashLogo from '../../../public/flipcash_header_logo.png';

const PrivacyPolicy: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-center mb-6">
            {/* <img 
              src={flipcashLogo} 
              alt="Flipcash Logo" 
              className="w-40 h-20 rounded-lg mr-4" 
            />
            <Lock className="w-16 h-16 text-[#FEC925]" /> */}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-4">
            Privacy Policy
          </h1>
          <p className="text-center text-blue-100 text-lg max-w-3xl mx-auto">
            Your privacy matters to us. Learn how we protect your personal data.
          </p>
          <p className="text-center text-blue-200 text-sm mt-4">
            Last Updated: November 2025
          </p>
        </div>
      </section>

      {/* Company Information */}
      <section className="py-8 bg-[#FEC925]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <MapPin className="w-5 h-5 text-black" />
              <div>
                <p className="font-semibold text-black">Registered Office</p>
                <p className="text-sm text-black/80">Gurugram, Haryana – 122007</p>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-3">
              <Mail className="w-5 h-5 text-black" />
              <div>
                <p className="font-semibold text-black">Support Email</p>
                <a href="mailto:support@flipcash.in" className="text-sm text-black/80 hover:text-black">
                  support@flipcash.in
                </a>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-3">
              <Phone className="w-5 h-5 text-black" />
              <div>
                <p className="font-semibold text-black">Support Phone</p>
                <a href="tel:+919654786218" className="text-sm text-black/80 hover:text-black">
                  +91 96547 86218
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          
          {/* Section 1: Introduction */}
          <div className="mb-12">
            <div className="flex items-center mb-4">
              <Shield className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">1. Introduction</h2>
            </div>
            <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-600">
              <p className="text-gray-700 leading-relaxed mb-4">
                At <strong>Flipcash</strong> ("we", "us", "our"), protecting your personal data and ensuring your privacy is a top priority. This Privacy Policy explains how we collect, use, disclose, store, and protect your personal information through our Platform — including the Customer website, Customer iOS/Android apps, Partner Android app and website, as well as our Admin web panel.
              </p>
              <p className="text-gray-700 leading-relaxed">
                This Policy is aligned with <strong>Google Play Data Safety, Apple App Store Privacy Labels</strong>, and payment-gateway compliance, as well as the <strong>Digital Personal Data Protection Act, 2023 (DPDPA)</strong> and other applicable Indian laws.
              </p>
            </div>
          </div>

          {/* Section 2: Scope */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">2. Scope of This Policy</h2>
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6">
              <p className="text-gray-700 mb-4 font-semibold">This Policy applies when you:</p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0 text-sm">✓</span>
                  <p className="text-gray-700">Use our website(s) at <strong>www.flipcash.in</strong> (and sub-domains such as partner.flipcash.in)</p>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0 text-sm">✓</span>
                  <p className="text-gray-700">Use our mobile apps on Android or iOS (Customer / Partner)</p>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0 text-sm">✓</span>
                  <p className="text-gray-700">Interact with the Platform via web, app, call, SMS/WhatsApp or other electronic means</p>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0 text-sm">✓</span>
                  <p className="text-gray-700">Provide us personal data or we collect it via device/app usage (e.g., device details, IMEI, location)</p>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 3: What Information We Collect */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Database className="w-6 h-6 text-[#FEC925] mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">3. What Information We Collect</h2>
            </div>

            {/* A. Information You Provide */}
            <div className="mb-6 bg-green-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">A</span>
                Information You Provide
              </h3>
              <p className="text-gray-700 mb-3">We collect information directly when you:</p>
              <ul className="space-y-2 text-gray-700 ml-11">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span><strong>Register an account</strong> (name, email, phone, address)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span><strong>Upload KYC/bank/UPI details</strong> (Aadhaar, PAN, bank account, IFSC)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span><strong>Provide device details</strong> (brand, model, IMEI/serial, condition, photos)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span><strong>Submit booking or lead requests</strong> (pickup address, schedule)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span><strong>Contact support</strong> or provide feedback via chat, email, phone</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span><strong>Use partner portal functions</strong> (lead claims, wallet top-ups, documentation)</span>
                </li>
              </ul>
            </div>

            {/* B. Automatically Collected Data */}
            <div className="mb-6 bg-purple-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">B</span>
                Automatically Collected Data
              </h3>
              <p className="text-gray-700 mb-3">When you use our Platform, we collect:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-11">
                <div className="flex items-center gap-2">
                  <span className="text-purple-600">📱</span>
                  <span className="text-gray-700 text-sm">Device identifiers (Android ID, IDFA/IDFV)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-purple-600">🌐</span>
                  <span className="text-gray-700 text-sm">IP address, browser/device type</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-purple-600">📍</span>
                  <span className="text-gray-700 text-sm">Location data (with permission)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-purple-600">📊</span>
                  <span className="text-gray-700 text-sm">Analytics metadata</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-purple-600">🔐</span>
                  <span className="text-gray-700 text-sm">Session identifiers</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-purple-600">📝</span>
                  <span className="text-gray-700 text-sm">Usage logs & crash reports</span>
                </div>
              </div>
            </div>

            {/* C. Data From Third-Parties */}
            <div className="bg-orange-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-orange-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">C</span>
                Data From Third-Parties
              </h3>
              <p className="text-gray-700 mb-3">We may obtain data from:</p>
              <ul className="space-y-2 text-gray-700 ml-11">
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">•</span>
                  <span>Payment gateway providers (transaction status, refund details)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">•</span>
                  <span>Analytics providers (Firebase, Google Analytics)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">•</span>
                  <span>OTP/SMS gateways (MSG91)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">•</span>
                  <span>Publicly available sources or business data aggregators for partners</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 4: How We Use Your Information */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Eye className="w-6 h-6 text-[#FEC925] mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">4. How We Use Your Information</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                    <th className="p-4 text-left font-semibold">Purpose</th>
                    <th className="p-4 text-left font-semibold">Legal Basis</th>
                    <th className="p-4 text-left font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-900">Account creation</td>
                    <td className="p-4 text-gray-700">Contract / Consent</td>
                    <td className="p-4 text-gray-700">Set up your account, verify identity, KYC for payouts</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-900">Device transactions</td>
                    <td className="p-4 text-gray-700">Contract / Legitimate interest</td>
                    <td className="p-4 text-gray-700">Estimate value, schedule pickup, partner verification, payment</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-900">Wallet & payments</td>
                    <td className="p-4 text-gray-700">Contract / Legal obligation</td>
                    <td className="p-4 text-gray-700">Manage wallet balance, top-ups, payouts, claim fees</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-900">Analytics</td>
                    <td className="p-4 text-gray-700">Legitimate interest</td>
                    <td className="p-4 text-gray-700">Track usage, improve features, optimize performance</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-900">Marketing</td>
                    <td className="p-4 text-gray-700">Consent</td>
                    <td className="p-4 text-gray-700">Send offers, updates, newsletters (you may opt-out)</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-900">Compliance</td>
                    <td className="p-4 text-gray-700">Legal obligation</td>
                    <td className="p-4 text-gray-700">Monitor transactions, AML/KYC checks, audits</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-900">App store disclosures</td>
                    <td className="p-4 text-gray-700">Legal obligation</td>
                    <td className="p-4 text-gray-700">Provide data safety info for Google/Apple and payment partners</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 5: Disclosure */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Users className="w-6 h-6 text-[#FEC925] mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">5. Disclosure of Your Personal Data</h2>
            </div>
            <div className="bg-yellow-50 border-l-4 border-[#FEC925] rounded-lg p-6">
              <p className="text-gray-700 mb-4 font-semibold">We may share your personal information with:</p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-[#FEC925] mr-2 font-bold">▸</span>
                  <span><strong>Service providers</strong> (payment gateway, analytics, hosting, SMS/OTP) — strictly for providing services</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#FEC925] mr-2 font-bold">▸</span>
                  <span><strong>Partners</strong> — when a lead is matched, only necessary data is shared securely</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#FEC925] mr-2 font-bold">▸</span>
                  <span><strong>Regulators / law enforcement</strong> — when required by applicable law or legal process</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#FEC925] mr-2 font-bold">▸</span>
                  <span><strong>Business transfers</strong> — in case of merger, acquisition or asset sale, data may transfer under equivalent protection</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#FEC925] mr-2 font-bold">▸</span>
                  <span><strong>Your consent</strong> — for third-party marketing or referrals</span>
                </li>
              </ul>
              <div className="mt-4 bg-white rounded p-3 border border-yellow-300">
                <p className="text-gray-700 font-medium">🔒 We anonymize and aggregate data for analytics and <strong>will NOT sell your personal data</strong> to unrelated parties.</p>
              </div>
            </div>
          </div>

          {/* Section 6: Data Retention */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">6. Data Retention & Storage</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border-2 border-blue-200 rounded-lg p-5">
                <div className="flex items-center mb-3">
                  <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 font-bold">7</span>
                  <h4 className="font-bold text-gray-900">Years</h4>
                </div>
                <p className="text-gray-700 text-sm">KYC and transaction data (regulatory compliance)</p>
              </div>
              <div className="bg-white border-2 border-green-200 rounded-lg p-5">
                <div className="flex items-center mb-3">
                  <span className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 font-bold">2</span>
                  <h4 className="font-bold text-gray-900">Years</h4>
                </div>
                <p className="text-gray-700 text-sm">Device listing, lead details after completion</p>
              </div>
              <div className="bg-white border-2 border-purple-200 rounded-lg p-5">
                <div className="flex items-center mb-3">
                  <span className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 font-bold">∞</span>
                  <h4 className="font-bold text-gray-900">Until Withdrawn</h4>
                </div>
                <p className="text-gray-700 text-sm">Marketing preferences (you may opt-out anytime)</p>
              </div>
              <div className="bg-white border-2 border-orange-200 rounded-lg p-5">
                <div className="flex items-center mb-3">
                  <span className="bg-orange-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 font-bold">🗑️</span>
                  <h4 className="font-bold text-gray-900">After Retention</h4>
                </div>
                <p className="text-gray-700 text-sm">Data is anonymised or securely deleted</p>
              </div>
            </div>
            <div className="mt-6 bg-gray-100 rounded-lg p-4">
              <p className="text-gray-700 text-sm">
                📍 Data is stored in <strong>India</strong> on secure servers/Cloud infrastructure. For international transfers (e.g., analytics), we ensure appropriate safeguards and comply with Indian transfer requirements.
              </p>
            </div>
          </div>

          {/* Section 7: Your Rights */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Scale className="w-6 h-6 text-[#FEC925] mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">7. Your Rights under DPDPA 2023</h2>
            </div>
            <div className="bg-gradient-to-br from-blue-900 to-blue-700 text-white rounded-2xl p-8">
              <p className="text-blue-100 mb-6">You have the following rights:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start">
                  <span className="bg-[#FEC925] text-black rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0 font-bold text-sm">✓</span>
                  <p className="text-white"><strong>Right to access</strong> your personal data held with us</p>
                </div>
                <div className="flex items-start">
                  <span className="bg-[#FEC925] text-black rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0 font-bold text-sm">✓</span>
                  <p className="text-white"><strong>Right to correction</strong> of inaccurate or incomplete data</p>
                </div>
                <div className="flex items-start">
                  <span className="bg-[#FEC925] text-black rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0 font-bold text-sm">✓</span>
                  <p className="text-white"><strong>Right to erasure</strong> (subject to legal/regulatory retention)</p>
                </div>
                <div className="flex items-start">
                  <span className="bg-[#FEC925] text-black rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0 font-bold text-sm">✓</span>
                  <p className="text-white"><strong>Right to data portability</strong> in a structured format</p>
                </div>
                <div className="flex items-start">
                  <span className="bg-[#FEC925] text-black rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0 font-bold text-sm">✓</span>
                  <p className="text-white"><strong>Right to withdraw consent</strong> or object to processing</p>
                </div>
                <div className="flex items-start">
                  <span className="bg-[#FEC925] text-black rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0 font-bold text-sm">✓</span>
                  <p className="text-white"><strong>Right to restrict processing</strong> in some cases</p>
                </div>
                <div className="flex items-start md:col-span-2">
                  <span className="bg-[#FEC925] text-black rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0 font-bold text-sm">✓</span>
                  <p className="text-white"><strong>Right to lodge complaint</strong> with Indian data protection authorities</p>
                </div>
              </div>
              <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-white">
                  📧 To exercise rights, email <a href="mailto:privacy@flipcash.in" className="text-[#FEC925] font-bold hover:text-yellow-300">privacy@flipcash.in</a> — we aim to respond within <strong>30 working days</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Section 8: Security */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Lock className="w-6 h-6 text-green-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">8. Security & Organizational Measures</h2>
            </div>
            <div className="bg-green-50 rounded-lg p-6">
              <p className="text-gray-700 mb-4 font-semibold">We implement industry-standard safeguards:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-3">🔐</span>
                    <h4 className="font-bold text-gray-900">Encryption</h4>
                  </div>
                  <p className="text-gray-700 text-sm">TLS 1.2/1.3 for data transit, AES-256 for data at rest</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-3">👥</span>
                    <h4 className="font-bold text-gray-900">Access Controls</h4>
                  </div>
                  <p className="text-gray-700 text-sm">Role-based permissions, audit logs</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-3">🛡️</span>
                    <h4 className="font-bold text-gray-900">Security Testing</h4>
                  </div>
                  <p className="text-gray-700 text-sm">Regular VAPT (vulnerability assessment & penetration testing)</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-3">🔒</span>
                    <h4 className="font-bold text-gray-900">Isolation</h4>
                  </div>
                  <p className="text-gray-700 text-sm">Isolation of Partner and Admin systems</p>
                </div>
              </div>
              <div className="mt-4 bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded">
                <p className="text-gray-800 text-sm">
                  ⚠️ <strong>Note:</strong> No system is 100% secure — you must safeguard your credentials and notify us of any unauthorized access.
                </p>
              </div>
            </div>
          </div>

          {/* Section 9: App Store & Payment Gateway */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">9. App Store & Payment Gateway Disclosures</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Mobile Apps */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border-2 border-purple-200">
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">📱</span>
                  <h3 className="text-xl font-bold text-gray-900">Mobile Apps</h3>
                </div>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">•</span>
                    <span>Customer & Partner apps comply with <strong>Google Play</strong> and <strong>Apple App Store Guidelines</strong></span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">•</span>
                    <span>Data safety labels and permission disclosures are accurate and up-to-date</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">•</span>
                    <span>Wallet/payout flows, location checks clearly described and consented to</span>
                  </li>
                </ul>
              </div>

              {/* Payments */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6 border-2 border-blue-200">
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">💳</span>
                  <h3 className="text-xl font-bold text-gray-900">Payments</h3>
                </div>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>We partner with PSPs (e.g., <strong>Razorpay/Cashfree</strong>)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Expect KYC, transaction logs and dispute/charge-back mechanisms</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Payment data processed subject to PSP terms and RBI guidelines</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 10: Cookies */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Cookie className="w-6 h-6 text-[#FEC925] mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">10. Cookies & Tracking Technologies</h2>
            </div>
            <div className="bg-orange-50 border-l-4 border-orange-500 rounded-lg p-6">
              <p className="text-gray-700 leading-relaxed">
                Our use of cookies and similar mechanisms is described in our separate <strong>Cookie Policy</strong>, which applies across web and app surfaces. Tracking technologies help with analytics, performance, marketing and security — you can control preferences as per our cookie preference banner/settings.
              </p>
              <button
                onClick={() => navigate('/cookies')}
                className="mt-4 bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
              >
                View Cookie Policy
              </button>
            </div>
          </div>

          {/* Section 11: Children's Privacy */}
          <div className="mb-12">
            <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Bell className="w-6 h-6 text-red-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">11. Children's Privacy</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Our Platform is intended for individuals <strong>18+</strong>. We do not knowingly collect personal data from children under 18 without parental consent. If you believe a child has provided us with personal data without consent, contact us immediately and we will take action.
              </p>
            </div>
          </div>

          {/* Section 12-13: Changes & Contact */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">12. Changes to This Privacy Policy</h2>
              <p className="text-gray-700">
                We may update this policy when necessary (e.g., regulatory change, business model change, new features). We will post the new "Last updated" date and notify you as appropriate. Continued use means you accept the changes.
              </p>
            </div>
          </div>

          {/* Contact & Grievance Section */}
          <div className="mt-12 bg-gradient-to-br from-gray-900 to-black text-white rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6 text-[#FEC925]">13. Contact & Grievance Officer</h2>
            <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
              <p className="text-white mb-4"><strong>Grievance Officer:</strong> Gaurav Kumar (Operations)</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-300 mb-1">📧 Email:</p>
                  <a href="mailto:grievance@flipcash.in" className="text-[#FEC925] hover:text-yellow-300">
                    grievance@flipcash.in
                  </a>
                </div>
                <div>
                  <p className="text-gray-300 mb-1">📞 Phone:</p>
                  <a href="tel:+919654786218" className="text-[#FEC925] hover:text-yellow-300">
                    +91 96547 86218
                  </a>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-gray-300 mb-1">📍 Registered Office:</p>
                <p className="text-white text-sm">
                  7th Floor, Unit No. 703, Palm Court, Mehrauli Gurgaon Road,<br />
                  Sukhrali Chowk, Sector 16, Gurugram, Haryana – 122007
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-[#FEC925]">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h3 className="text-2xl font-bold text-black mb-4">Questions About Your Privacy?</h3>
          <p className="text-black/80 mb-6">We're here to help protect your data</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/contact')}
              className="bg-black text-[#FEC925] px-8 py-3 rounded-lg font-bold hover:bg-gray-900 transition-colors duration-300"
            >
              Contact Privacy Team
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-white text-black px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors duration-300"
            >
              Back to Home
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;