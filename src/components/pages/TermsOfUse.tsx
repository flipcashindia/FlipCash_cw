// src/pages/TermsOfUse.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Users, Smartphone, CreditCard, Lock, Scale, Mail, Phone, MapPin } from 'lucide-react';
// import flipcashLogo from '../../../public/flipcash_header_logo.png';

const TermsOfUse: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-900 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-center mb-6">
            {/* <img 
              src={flipcashLogo} 
              alt="Flipcash Logo" 
              className="w-40 h-20 rounded-lg mr-4" 
            />
            <FileText className="w-16 h-16 text-[#FEC925]" /> */}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-4">
            Terms of Use
          </h1>
          <p className="text-center text-indigo-100 text-lg max-w-3xl mx-auto">
            Guidelines for using the Flipcash Platform
          </p>
          <p className="text-center text-indigo-200 text-sm mt-4">
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
          
          {/* Section 1: About These Terms */}
          <div className="mb-12">
            <div className="flex items-center mb-4">
              <FileText className="w-6 h-6 text-indigo-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">1. About these Terms</h2>
            </div>
            <div className="bg-indigo-50 rounded-lg p-6 border-l-4 border-indigo-600">
              <p className="text-gray-700 leading-relaxed mb-4">
                These Terms of Use ("Terms") govern your use of Flipcash's consumer and partner experiences, including:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <p className="font-semibold text-gray-900 text-sm">Customer surfaces</p>
                  <p className="text-gray-600 text-xs">Mobile apps & flipcash.in</p>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <p className="font-semibold text-gray-900 text-sm">Partner surfaces</p>
                  <p className="text-gray-600 text-xs">Partner app & web console</p>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <p className="font-semibold text-gray-900 text-sm">Admin surface</p>
                  <p className="text-gray-600 text-xs">Admin web panel (restricted)</p>
                </div>
              </div>
              <p className="text-gray-700 mt-4">
                By creating an account, accessing, or using any Flipcash surface (collectively, the "Platform"), you agree to these Terms and our <button onClick={() => navigate('/privacy')} className="text-indigo-600 font-semibold hover:text-indigo-800">Privacy Policy</button> and <button onClick={() => navigate('/cookies')} className="text-indigo-600 font-semibold hover:text-indigo-800">Cookie Policy</button>.
              </p>
            </div>
          </div>

          {/* Section 2: What Flipcash Does */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">2. What Flipcash Does</h2>
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-6">
              <p className="text-gray-700 mb-4 font-semibold">
                Flipcash is a re-commerce marketplace that helps customers sell used electronic devices (phones, laptops, tablets, smartwatches), while verified Partners inspect and purchase those devices.
              </p>
              <div className="space-y-2">
                <div className="flex items-start">
                  <span className="text-[#FEC925] mr-2 text-xl">✓</span>
                  <span className="text-gray-700">Price estimation, booking & scheduling</span>
                </div>
                <div className="flex items-start">
                  <span className="text-[#FEC925] mr-2 text-xl">✓</span>
                  <span className="text-gray-700">KYC & verification workflows</span>
                </div>
                <div className="flex items-start">
                  <span className="text-[#FEC925] mr-2 text-xl">✓</span>
                  <span className="text-gray-700">Secure payouts/wallet features</span>
                </div>
                <div className="flex items-start">
                  <span className="text-[#FEC925] mr-2 text-xl">✓</span>
                  <span className="text-gray-700">Partner lead marketplace, visit & verification, offer & deal completion</span>
                </div>
                <div className="flex items-start">
                  <span className="text-[#FEC925] mr-2 text-xl">✓</span>
                  <span className="text-gray-700">Admin tools for compliance, pricing, wallets, and support</span>
                </div>
              </div>
              <div className="mt-4 bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded">
                <p className="text-gray-800 text-sm">
                  <strong>Important:</strong> Flipcash is not the seller or buyer of record for most transactions; Partners purchase devices directly from Customers. Flipcash facilitates discovery, logistics, and payments subject to these Terms.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Eligibility & Accounts */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Users className="w-6 h-6 text-[#FEC925] mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">3. Eligibility & Accounts</h2>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0 font-bold text-sm">1</span>
                <p className="text-gray-700">You must be <strong>18+</strong> and capable of entering a binding contract in India.</p>
              </li>
              <li className="flex items-start">
                <span className="bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0 font-bold text-sm">2</span>
                <p className="text-gray-700">Provide accurate information; keep it updated; do not share your OTP or auth credentials.</p>
              </li>
              <li className="flex items-start">
                <span className="bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0 font-bold text-sm">3</span>
                <p className="text-gray-700">We may require <strong>KYC</strong> to use payouts or Partner features.</p>
              </li>
              <li className="flex items-start">
                <span className="bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0 font-bold text-sm">4</span>
                <p className="text-gray-700">Inactivity may lead to session expiration or account deactivation for security.</p>
              </li>
            </ul>
          </div>

          {/* Section 4: Roles & Responsibilities */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">4. Roles & Responsibilities</h2>
            
            {/* 4.1 Customers */}
            <div className="mb-6 bg-green-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">4.1</span>
                Customers
              </h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span>Use the Platform to estimate device value, book pickup, and get paid after on-site verification.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span>Ensure the device is yours to sell; remove SIM/lock and factory-reset before handover.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span>You may accept or decline Partner's final offer (post-verification).</span>
                </li>
              </ul>
            </div>

            {/* 4.2 Partners */}
            <div className="mb-6 bg-blue-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">4.2</span>
                Partners
              </h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Use the Platform to view/claim leads, visit the customer, verify the device, propose offers, and complete purchases.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Follow KYC, device-check SOPs, and upload required photos/IMEI verification.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Pay the agreed amount to the Customer upon successful deal; pay applicable fees/commissions to Flipcash per your Partner agreement.</span>
                </li>
              </ul>
            </div>

            {/* 4.3 Flipcash */}
            <div className="bg-purple-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">4.3</span>
                Flipcash
              </h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  <span>Operates the marketplace, escrow/wallet rails, and support tooling.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  <span>May hold, release, or reverse amounts in line with these Terms, applicable law, fraud checks, and Partner/User agreements.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 5: Payments, Wallets & Fees */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <CreditCard className="w-6 h-6 text-[#FEC925] mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">5. Payments, Wallets & Fees</h2>
            </div>
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 border-l-4 border-[#FEC925]">
              <p className="text-gray-700 mb-4">
                Payment rails may be provided via <strong>RBI-regulated payment partners</strong> (e.g., Razorpay/Cashfree). Flipcash/partner banks may conduct due diligence, KYC, or transaction monitoring as required by law.
              </p>
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-bold text-gray-900 mb-2">💰 Customer Payouts</h4>
                  <p className="text-gray-700 text-sm">Released after successful verification and acceptance of the final offer.</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-bold text-gray-900 mb-2">👛 Partner Wallet</h4>
                  <p className="text-gray-700 text-sm">May require top-ups for claim fees or operational charges; statements show debits/credits, commissions, and settlements.</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-bold text-gray-900 mb-2">💳 Fees/Charges</h4>
                  <p className="text-gray-700 text-sm">Flipcash may levy claim fees, commissions, convenience or service charges, and applicable taxes; fee details are shown before you confirm an action.</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-bold text-gray-900 mb-2">⚠️ Chargebacks/Disputes</h4>
                  <p className="text-gray-700 text-sm">We may place holds or reversals if fraud, unauthorized use, or regulatory flags occur, per PSP/banking requirements.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 6: Cancellations, Re-quotes & Refunds */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">6. Cancellations, Re-quotes & Refunds</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-5">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                  <span className="text-2xl mr-2">🔄</span>
                  Re-quote
                </h4>
                <p className="text-gray-700 text-sm">If device condition/features differ from initial answers/photos, Partner may adjust offer on-site with transparent reasons.</p>
              </div>
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-5">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                  <span className="text-2xl mr-2">❌</span>
                  Cancellation
                </h4>
                <p className="text-gray-700 text-sm">If either party cancels before completion, any holds or fees are handled per the flow shown in-app.</p>
              </div>
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-5">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                  <span className="text-2xl mr-2">💵</span>
                  Refunds
                </h4>
                <p className="text-gray-700 text-sm">Gateway fees, claim fees, or payouts may be refunded/adjusted as per outcome, fraud checks, and PSP rules.</p>
              </div>
            </div>
          </div>

          {/* Section 7: Device Handover & Data Safety */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Lock className="w-6 h-6 text-red-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">7. Device Handover & Data Safety</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Before Handover - Customers */}
              <div className="bg-red-50 rounded-lg p-6 border-l-4 border-red-500">
                <h3 className="font-bold text-gray-900 mb-3">Before handover, Customers must:</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">✓</span>
                    <span>Back up and factory-reset the device</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">✓</span>
                    <span>Remove iCloud/Google locks and SIM/memory cards</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">✓</span>
                    <span>Delete personal data and disable "Find My" or similar locks</span>
                  </li>
                </ul>
              </div>

              {/* Partners Must */}
              <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500">
                <h3 className="font-bold text-gray-900 mb-3">Partners must:</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>Verify IMEI/serial and upload required media</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>Never attempt to access personal content</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>Follow lawful practices and respect privacy requirements</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 8: Acceptable Use */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">8. Acceptable Use & Prohibited Conduct</h2>
            <div className="bg-red-50 border-l-4 border-red-600 rounded-lg p-6">
              <p className="text-gray-700 mb-4 font-semibold">You agree NOT to:</p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">✗</span>
                  <span>Violate law, infringe IP, or engage in fraud/identity theft/spam</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">✗</span>
                  <span>Bypass security, misuse wallets, or manipulate ratings/claims</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">✗</span>
                  <span>Trade stolen/blacklisted devices or restricted items</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">✗</span>
                  <span>Interfere with Platform operations (malware, scraping, denial of service)</span>
                </li>
              </ul>
              <div className="mt-4 bg-white rounded p-3">
                <p className="text-gray-700 text-sm">
                  ⚠️ We may suspend/terminate accounts for violations, protect users, and cooperate with authorities.
                </p>
              </div>
            </div>
          </div>

          {/* Section 9: App Permissions */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Smartphone className="w-6 h-6 text-[#FEC925] mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">9. App Permissions & Disclosures</h2>
            </div>
            <div className="bg-purple-50 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                To provide full functionality, our apps may request:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-3">📍</span>
                    <h4 className="font-bold text-gray-900">Location</h4>
                  </div>
                  <p className="text-gray-700 text-sm">For lead distance, check-in geo-fence, route/map</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-3">📷</span>
                    <h4 className="font-bold text-gray-900">Camera/Photos</h4>
                  </div>
                  <p className="text-gray-700 text-sm">Device images, KYC, IMEI scan</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-3">🔔</span>
                    <h4 className="font-bold text-gray-900">Notifications</h4>
                  </div>
                  <p className="text-gray-700 text-sm">Lead updates, payouts</p>
                </div>
              </div>
              <p className="text-gray-700 text-sm mt-4">
                These are disclosed in-app and on the store listings; you can revoke them in OS settings.
              </p>
            </div>
          </div>

          {/* Sections 10-17: Condensed */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">10. Data, Privacy & Cookies</h2>
              <p className="text-gray-700">
                Use of the Platform is subject to our <button onClick={() => navigate('/privacy')} className="text-indigo-600 font-semibold hover:text-indigo-800">Privacy Policy</button> and <button onClick={() => navigate('/cookies')} className="text-indigo-600 font-semibold hover:text-indigo-800">Cookie Policy</button>. We process personal data per the <strong>Digital Personal Data Protection Act, 2023 (DPDPA)</strong>.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">11. Third-Party Services</h2>
              <p className="text-gray-700">
                Our Platform integrates third-party services (payments, analytics, maps, hosting/CDN). Each third party may process data under its own terms and privacy policy.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">12. Intellectual Property</h2>
              <p className="text-gray-700">
                All Flipcash trademarks, logos, software, text, graphics, and layouts are protected by law. You receive a limited, non-exclusive, non-transferable license to access and use the Platform.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">13. Platform Changes & Availability</h2>
              <p className="text-gray-700">
                We may add/modify features, impose limits, or discontinue parts of the Platform without notice. We strive for uptime, but the Platform may be unavailable due to maintenance, outages, or events beyond our control.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">14. Disclaimers & Limitation of Liability</h2>
              <p className="text-gray-700">
                The Platform is provided <strong>"as is"</strong> and <strong>"as available"</strong>. Flipcash is not liable for indirect, incidental, or consequential damages arising from your use of the Platform.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">15. Indemnity</h2>
              <p className="text-gray-700">
                You agree to indemnify and hold harmless Flipcash from any claims, losses, liabilities, costs arising from your breach of these Terms or misuse of the Platform.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">16. Suspension & Termination</h2>
              <p className="text-gray-700">
                We may suspend or terminate access for policy violations, fraud risk, non-payment, legal requests, or risk to users.
              </p>
            </div>

            <div className="flex items-center mb-3">
              <Scale className="w-6 h-6 text-[#FEC925] mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">17. Governing Law & Disputes</h2>
            </div>
            <div className="bg-gray-100 rounded-lg p-4">
              <p className="text-gray-700">
                These Terms are governed by the <strong>laws of India</strong>. Courts in <strong>Gurugram, Haryana</strong> will have exclusive jurisdiction.
              </p>
            </div>
          </div>

          {/* Contact & Grievance Section */}
          <div className="mt-12 bg-gradient-to-br from-gray-900 to-black text-white rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6 text-[#FEC925]">18. Contact & Grievance Redressal (DPDPA)</h2>
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

            <div className="mt-6 space-y-4">
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="font-bold text-white mb-2">19. App Store / Play Store Notices</h3>
                <p className="text-gray-300 text-sm">
                  Our apps adhere to Google Play Developer Policies and Apple App Store Review Guidelines, with full disclosure of data types collected, purposes, and optionality.
                </p>
              </div>

              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="font-bold text-white mb-2">20. Payment Gateway & KYC Notices</h3>
                <p className="text-gray-300 text-sm">
                  We comply with PSP onboarding & KYC obligations; we may share required information with payment partners to process payouts/settlements.
                </p>
              </div>

              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="font-bold text-white mb-2">21. Changes to These Terms</h3>
                <p className="text-gray-300 text-sm">
                  We may update these Terms periodically. The "Last Updated" date shows the latest version. Continued use means you accept the updated Terms.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-[#FEC925]">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h3 className="text-2xl font-bold text-black mb-4">Questions About Terms of Use?</h3>
          <p className="text-black/80 mb-6">We're here to help clarify our platform guidelines</p>
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

export default TermsOfUse;