// src/pages/TermsAndConditions.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, FileText, Users, Wallet, AlertCircle, Scale, Mail, Phone, MapPin } from 'lucide-react';
// import flipcashLogo from '../../../public/flipcash_header_logo.png';

const TermsAndConditions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 to-black text-white py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-center mb-6">
            <Shield className="w-16 h-16 text-[#FEC925] mr-4" />
            <h1 className="text-4xl md:text-5xl font-extrabold">
              Terms & Conditions
            </h1>
          </div>
          <p className="text-center text-gray-300 text-lg max-w-3xl mx-auto">
            Flipcash Private Limited - Governing your use of our Platform
          </p>
          <p className="text-center text-gray-400 text-sm mt-4">
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
          
          {/* Section 1: Agreement */}
          <div className="mb-12">
            <div className="flex items-center mb-4">
              <FileText className="w-6 h-6 text-[#FEC925] mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">1. Agreement to These Terms</h2>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                These Terms & Conditions ("Terms") govern your access to and use of the Platform — including the <strong>Customer Website, Customer iOS & Android Apps, Partner Website, Partner Android App, and Admin Web Panel</strong> (collectively, the "Platform").
              </p>
              <p className="text-gray-700 leading-relaxed">
                By downloading, accessing or using any of the Platform's services, you agree to be bound by these Terms, as well as our Privacy Policy and Cookie Policy. If you do not agree with any provision of these Terms, you must stop using the Platform immediately.
              </p>
            </div>
          </div>

          {/* Section 2: Definitions */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">2. Definitions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <h3 className="font-bold text-gray-900 mb-2">Customer</h3>
                <p className="text-gray-700 text-sm">A user who lists a used electronic device for sale via the Platform.</p>
              </div>
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <h3 className="font-bold text-gray-900 mb-2">Partner</h3>
                <p className="text-gray-700 text-sm">A verified business or individual who claims leads, visits Customers, verifies devices, and executes transactions.</p>
              </div>
              <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
                <h3 className="font-bold text-gray-900 mb-2">Lead</h3>
                <p className="text-gray-700 text-sm">A confirmed sale request initiated by a Customer and accepted by a Partner.</p>
              </div>
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                <h3 className="font-bold text-gray-900 mb-2">Offer</h3>
                <p className="text-gray-700 text-sm">The final price proposed by a Partner after device inspection.</p>
              </div>
              <div className="bg-pink-50 border-l-4 border-pink-500 p-4 rounded">
                <h3 className="font-bold text-gray-900 mb-2">Wallet</h3>
                <p className="text-gray-700 text-sm">A digital account maintained by Flipcash where credits, debits, claim fees, payouts are tracked.</p>
              </div>
              <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded">
                <h3 className="font-bold text-gray-900 mb-2">Device</h3>
                <p className="text-gray-700 text-sm">Any supported electronic gadget (phone, laptop, tablet, smartwatch) listed for sale.</p>
              </div>
            </div>
          </div>

          {/* Section 3: Accounts and Registration */}
          <div className="mb-12">
            <div className="flex items-center mb-4">
              <Users className="w-6 h-6 text-[#FEC925] mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">3. Accounts and Registration</h2>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="bg-[#FEC925] text-black rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0 font-bold">✓</span>
                <p className="text-gray-700">You must be at least <strong>18 years old</strong> and legally capable of entering into a binding contract.</p>
              </li>
              <li className="flex items-start">
                <span className="bg-[#FEC925] text-black rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0 font-bold">✓</span>
                <p className="text-gray-700">You agree to provide accurate, complete and updated registration and KYC information when required.</p>
              </li>
              <li className="flex items-start">
                <span className="bg-[#FEC925] text-black rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0 font-bold">✓</span>
                <p className="text-gray-700">You are responsible for safeguarding your login credentials, and any activity under your account is your responsibility.</p>
              </li>
              <li className="flex items-start">
                <span className="bg-[#FEC925] text-black rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0 font-bold">✓</span>
                <p className="text-gray-700">Flipcash may require additional verification (documents, bank/UPI details) to permit payouts or certain Partner features.</p>
              </li>
              <li className="flex items-start">
                <span className="bg-[#FEC925] text-black rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0 font-bold">✓</span>
                <p className="text-gray-700">Flipcash reserves the right to suspend, restrict or terminate accounts in case of violations, fraud, payments issues, or regulatory risk.</p>
              </li>
            </ul>
          </div>

          {/* Section 4: Platform Use */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">4. Platform Use: Customer, Partner & Admin</h2>
            
            {/* Customer Use */}
            <div className="mb-6 bg-blue-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">4.1 Customer Use</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Customers may list Devices, get estimates, schedule pickups, receive offers, and get paid upon successful transaction completion.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Customers must ensure they are rightful owners of Devices. Devices must be prepared (e.g., SIM/SD removed, accounts signed out, factory-reset) before pickup.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Customers may decline final Offers. If accepted, payment will be made as per the Wallet/Bank/UPI option disclosed.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Use of Customer Apps must comply with store rules: no prohibited content, no explicit sensitive data misuse, permissions announced as per Google/Apple policies.</span>
                </li>
              </ul>
            </div>

            {/* Partner Use */}
            <div className="mb-6 bg-green-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">4.2 Partner Use</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span>Partners may browse and claim Leads, visit Customers, verify Devices, submit Offers, complete purchases and record documentation.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span>Partners must claim Leads only through the Partner App/Website and pay any claim fees or deposits required.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span>Partners must follow all verification, photographic, and documentation standards as required by Flipcash.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span>Partners must not negotiate outside the Platform, pick unauthorized Devices, or store Customer data off-Platform.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span>Violations may trigger penalties, suspensions, or account termination.</span>
                </li>
              </ul>
            </div>

            {/* Admin Use */}
            <div className="bg-purple-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">4.3 Admin Use</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  <span>Admin Web Panel is restricted to internal Flipcash operations, Partner & Customer management, wallet/payout processing, dispute resolution.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  <span>Access is strictly managed. Customers/Partners cannot use Admin Panel unless expressly authorised.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  <span>Admin actions must comply with data protection, audit logging, and payment regulator records.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 5: Payments */}
          <div className="mb-12">
            <div className="flex items-center mb-4">
              <Wallet className="w-6 h-6 text-[#FEC925] mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">5. Payments, Wallets & Financials</h2>
            </div>
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 border-l-4 border-[#FEC925]">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-[#FEC925] mr-2 font-bold">▸</span>
                  <span>All payments, wallet credits/debits, fee assessments, and payouts are subject to the terms of our payment partners (e.g., Razorpay, Cashfree etc.).</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#FEC925] mr-2 font-bold">▸</span>
                  <span>Wallet features may require regulatory KYC, and wallet funds may be held, frozen or reversed to comply with AML, KYC or payment-gateway rules.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#FEC925] mr-2 font-bold">▸</span>
                  <span>Claim fees, commissions, service charges, GST/other taxes may apply; these will be disclosed at time of transaction.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#FEC925] mr-2 font-bold">▸</span>
                  <span>Payment gateway rules mandate transparency on refunds, cancellations, chargebacks; Flipcash will abide by those rules.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 6: Transaction Flow */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">6. Device Transaction Flow, Cancellation & Refunds</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <span className="bg-[#FEC925] text-black font-bold rounded-full w-8 h-8 flex items-center justify-center mr-4">1</span>
                  <p className="text-gray-700">Customer lists Device → receives initial estimate → schedules pickup.</p>
                </div>
                <div className="flex items-center">
                  <span className="bg-[#FEC925] text-black font-bold rounded-full w-8 h-8 flex items-center justify-center mr-4">2</span>
                  <p className="text-gray-700">Partner visits → inspects Device → submits Offer.</p>
                </div>
                <div className="flex items-center">
                  <span className="bg-[#FEC925] text-black font-bold rounded-full w-8 h-8 flex items-center justify-center mr-4">3</span>
                  <p className="text-gray-700">If Customer accepts Offer, payout initiated; if declines, Lead is cancelled.</p>
                </div>
                <div className="flex items-center">
                  <span className="bg-[#FEC925] text-black font-bold rounded-full w-8 h-8 flex items-center justify-center mr-4">4</span>
                  <p className="text-gray-700">If inspection finds condition differs materially, Partner may issue a Re-quote; Customer may accept or cancel.</p>
                </div>
                <div className="flex items-center">
                  <span className="bg-[#FEC925] text-black font-bold rounded-full w-8 h-8 flex items-center justify-center mr-4">5</span>
                  <p className="text-gray-700">Refunds or reversals follow payment-gateway guidelines and may be subject to processing time or verification.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 7: Permissions */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">7. Permissions & Data Handling</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                <h4 className="font-bold text-gray-900 mb-2">📷 Camera</h4>
                <p className="text-gray-700 text-sm">For photos, IMEI scan</p>
              </div>
              <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                <h4 className="font-bold text-gray-900 mb-2">📍 Location</h4>
                <p className="text-gray-700 text-sm">For pickup/visit tracking</p>
              </div>
              <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                <h4 className="font-bold text-gray-900 mb-2">🔔 Notifications</h4>
                <p className="text-gray-700 text-sm">For updates</p>
              </div>
              <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                <h4 className="font-bold text-gray-900 mb-2">💾 Storage</h4>
                <p className="text-gray-700 text-sm">For photo uploads</p>
              </div>
            </div>
            <p className="text-gray-700 mt-4 text-sm">
              These items are disclosed in the privacy/data safety sections for the respective app stores. Partners or Users may revoke permissions in OS settings; if revoked, certain features may cease to function fully.
            </p>
          </div>

          {/* Section 8-9: IP & Acceptable Use */}
          <div className="mb-12 bg-red-50 border-l-4 border-red-500 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">9. Acceptable Use & Prohibitions</h2>
            </div>
            <p className="text-gray-700 mb-4 font-semibold">You agree NOT to:</p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-red-600 mr-2">✗</span>
                <span>Engage in illegal activities, money laundering, fraud, device resale of stolen or black-listed devices.</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-2">✗</span>
                <span>Introduce malware, harmful code, scraping bots, or attempt to interfere with payment systems.</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-2">✗</span>
                <span>Violate provider, store or regulatory rules (Google Play/Apple App Store, RBI/PSP rules).</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-2">✗</span>
                <span>Misrepresent identity, manipulate device data, submit false claims, or negotiate outside the Platform.</span>
              </li>
            </ul>
          </div>

          {/* Remaining Sections - Condensed */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">10. Privacy, Cookies & Data Protection</h2>
              <p className="text-gray-700">
                Use of the Platform is subject to our Privacy Policy and Cookie Policy. We comply with the <strong>Digital Personal Data Protection Act, 2023</strong>, IT Act 2000, and related regulations.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">11. Changes to Platform & Modification of Terms</h2>
              <p className="text-gray-700">
                Flipcash may modify or discontinue features, pricing, workflows at its discretion. We may revise these Terms from time to time. Continued use constitutes acceptance of the updated Terms.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">12. Disclaimers & Limitation of Liability</h2>
              <p className="text-gray-700">
                Platform is provided <strong>"as is"</strong> and <strong>"as available"</strong>. Flipcash is not liable for indirect, consequential, special damages, loss of profits, data, or goodwill arising from use of the Platform.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">13. Termination</h2>
              <p className="text-gray-700">
                Flipcash may suspend or terminate your access if you breach these Terms, violate regulation, fail KYC, or present fraud/identity risk.
              </p>
            </div>

            <div className="flex items-center mb-3">
              <Scale className="w-6 h-6 text-[#FEC925] mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">14. Governing Law & Dispute Resolution</h2>
            </div>
            <div className="bg-gray-100 rounded-lg p-4">
              <p className="text-gray-700">
                These Terms are governed by the <strong>laws of India</strong>. Disputes shall be subject to the exclusive jurisdiction of courts in <strong>Gurugram, Haryana</strong>, and may be referred to arbitration under the Arbitration & Conciliation Act, 1996.
              </p>
            </div>
          </div>

          {/* Section 15-16: Compliance & Contact */}
          <div className="mt-12 bg-gradient-to-br from-gray-900 to-black text-white rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">15. App Store & Payment-Gateway Compliance</h2>
            <p className="text-gray-300 mb-6">
              Our Android and iOS apps comply with Google Play Developer Policies and Apple App Store Review Guidelines. We disclose all data collection, permissions, location, wallet/payout use, and transaction flows in compliance with store rules.
            </p>

            <h2 className="text-2xl font-bold mb-4 text-[#FEC925]">16. Contact & Grievance</h2>
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

      {/* Back to Home CTA */}
      <section className="py-12 bg-[#FEC925]">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h3 className="text-2xl font-bold text-black mb-4">Have Questions?</h3>
          <p className="text-black/80 mb-6">Our support team is here to help you</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/contact')}
              className="bg-black text-[#FEC925] px-8 py-3 rounded-lg font-bold hover:bg-gray-900 transition-colors duration-300"
            >
              Contact Support
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

export default TermsAndConditions;