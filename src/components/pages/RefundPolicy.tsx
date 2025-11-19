// src/pages/RefundPolicy.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserCheck, XCircle, CheckCircle, DollarSign, AlertTriangle, Scale, Mail, Phone, MapPin } from 'lucide-react';
// import flipcashLogo from '../../../public/flipcash_header_logo.png';

const RefundPolicy: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-900 to-green-700 text-white py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-center mb-6">
            {/* <img 
              src={flipcashLogo} 
              alt="Flipcash Logo" 
              className="w-40 h-20 rounded-lg mr-4" 
            /> */}
            {/* <RefreshCw className="w-16 h-16 text-[#FEC925]" /> */}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-4">
            Refund & Cancellation Policy
          </h1>
          <p className="text-center text-green-100 text-lg max-w-3xl mx-auto">
            Transparent policies for cancellations, refunds, and wallet management
          </p>
          <p className="text-center text-green-200 text-sm mt-4">
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
          
          {/* Section 1: Scope & Applicability */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">1. Scope & Applicability</h2>
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border-l-4 border-green-600">
              <p className="text-gray-700 mb-4">This policy applies when you use any of our Platforms:</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center mb-2">
                    <User className="w-5 h-5 text-green-600 mr-2" />
                    <h4 className="font-bold text-gray-900">Customer</h4>
                  </div>
                  <p className="text-gray-700 text-sm">Web + iOS & Android apps</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center mb-2">
                    <UserCheck className="w-5 h-5 text-blue-600 mr-2" />
                    <h4 className="font-bold text-gray-900">Partner</h4>
                  </div>
                  <p className="text-gray-700 text-sm">Web + Android app</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center mb-2">
                    <Scale className="w-5 h-5 text-purple-600 mr-2" />
                    <h4 className="font-bold text-gray-900">Admin</h4>
                  </div>
                  <p className="text-gray-700 text-sm">Panel (internal use)</p>
                </div>
              </div>
              <p className="text-gray-700 mt-4">
                It governs <strong>cancellation of any service-flow</strong> and <strong>refunds of payments or wallet balances</strong> (Customer or Partner) when applicable.
              </p>
            </div>
          </div>

          {/* Section 2: Definitions */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">2. Definitions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <h3 className="font-bold text-gray-900 mb-2">Customer</h3>
                <p className="text-gray-700 text-sm">A user listing a used device via Flipcash for sale.</p>
              </div>
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <h3 className="font-bold text-gray-900 mb-2">Partner</h3>
                <p className="text-gray-700 text-sm">A verified agent/business claiming leads, visiting customers, verifying devices, making offers.</p>
              </div>
              <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
                <h3 className="font-bold text-gray-900 mb-2">Lead</h3>
                <p className="text-gray-700 text-sm">A booking/transaction initiated by a Customer and accepted by a Partner.</p>
              </div>
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                <h3 className="font-bold text-gray-900 mb-2">Wallet</h3>
                <p className="text-gray-700 text-sm">Digital account for credits, debits, payouts, and Partner claim-fees.</p>
              </div>
              <div className="bg-pink-50 border-l-4 border-pink-500 p-4 rounded">
                <h3 className="font-bold text-gray-900 mb-2">Offer</h3>
                <p className="text-gray-700 text-sm">Final price proposed by Partner post-verification, which Customer may accept.</p>
              </div>
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <h3 className="font-bold text-gray-900 mb-2">Cancellation</h3>
                <p className="text-gray-700 text-sm">Termination of a Lead or transaction before completion.</p>
              </div>
              <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded">
                <h3 className="font-bold text-gray-900 mb-2">Refund</h3>
                <p className="text-gray-700 text-sm">Return of money or wallet credit where applicable, subject to conditions.</p>
              </div>
            </div>
          </div>

          {/* Section 3: Cancellation by Customer */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <XCircle className="w-6 h-6 text-red-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">3. Cancellation by Customer</h2>
            </div>

            {/* 3.1 Before Visit */}
            <div className="mb-6 bg-green-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
                3.1 Before Visit/Verification
              </h3>
              <p className="text-gray-700 mb-3">A Customer may cancel a booked pickup <strong>before the Partner check-in/visit stage</strong>.</p>
              <div className="bg-white rounded-lg p-4 space-y-2">
                <div className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span className="text-gray-700">No claim fee is charged (if applicable)</span>
                </div>
                <div className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span className="text-gray-700">Any wallet credit or payout hold is released</span>
                </div>
                <div className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span className="text-gray-700">The booking is marked <strong>Cancelled–Customer</strong></span>
                </div>
              </div>
            </div>

            {/* 3.2 After Visit but Before Acceptance */}
            <div className="mb-6 bg-yellow-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <AlertTriangle className="w-6 h-6 text-yellow-600 mr-2" />
                3.2 After Visit/Verification but Before Offer Acceptance
              </h3>
              <p className="text-gray-700 mb-3">If cancellation occurs <strong>after Partner visit/verification but before Customer accepts the Offer</strong>:</p>
              <div className="bg-white rounded-lg p-4 space-y-2">
                <div className="flex items-start">
                  <span className="text-yellow-600 mr-2">⚠</span>
                  <span className="text-gray-700">Flipcash may charge a <strong>standard administrative fee</strong> (disclosed at booking time) to cover Partner logistics</span>
                </div>
                <div className="flex items-start">
                  <span className="text-yellow-600 mr-2">⚠</span>
                  <span className="text-gray-700">Wallet credit holds are removed once partner cost is settled</span>
                </div>
              </div>
            </div>

            {/* 3.3 Post Offer Acceptance */}
            <div className="bg-red-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <XCircle className="w-6 h-6 text-red-600 mr-2" />
                3.3 Post Offer Acceptance
              </h3>
              <p className="text-gray-700">
                Once Customer accepts the Offer and payout is initiated, <strong>cancellation is not permitted by Customer</strong> except under exceptional circumstances (fraud, non-compliance by Partner). Then section 5 (Refunds) applies.
              </p>
            </div>
          </div>

          {/* Section 4: Cancellation by Partner */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <UserCheck className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">4. Cancellation by Partner</h2>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                A Partner may cancel a Lead at any stage up to Offer submission, but must do so within the Platform workflow and record reasons.
              </p>
              <div className="bg-white rounded-lg p-4 space-y-3">
                <div>
                  <p className="font-semibold text-gray-900 mb-2">If Partner fails to honour booking/visit without valid reason:</p>
                  <ul className="space-y-2 ml-4">
                    <li className="flex items-start">
                      <span className="text-red-600 mr-2">•</span>
                      <span className="text-gray-700">Penalty fees may apply (per Terms & Conditions)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-600 mr-2">•</span>
                      <span className="text-gray-700">Wallet deduction or hold may be enforced</span>
                    </li>
                  </ul>
                </div>
                <div className="pt-3 border-t">
                  <p className="text-gray-700">
                    If a purchase is incomplete due to <strong>Partner decline after Customer acceptance</strong>: refund case may be processed per section 5.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Refunds & Wallet Credits */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <DollarSign className="w-6 h-6 text-[#FEC925] mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">5. Refunds & Wallet Credits</h2>
            </div>

            {/* 5.1 For Customers */}
            <div className="mb-6 bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">5.1 For Customers</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0 text-sm">1</span>
                  <span>If a Lead is cancelled by Flipcash (e.g., due to device blacklisting, regulatory issue, Partner no-show) before payout, the Customer's wallet credit or payout hold is <strong>released in full</strong>.</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0 text-sm">2</span>
                  <span>If a customer accepted an Offer and paid any advance (rare case) and the transaction fails due to Partner fault: refund is processed within <strong>7 business days</strong> to the original payout method or bank account.</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0 text-sm">3</span>
                  <span>Refunds do not apply in cases where Customer cancels post Offer acceptance except in good faith cases of fraud or mis-representation.</span>
                </li>
              </ul>
            </div>

            {/* 5.2 For Partners */}
            <div className="mb-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">5.2 For Partners</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0 text-sm">1</span>
                  <span>Partners' wallet credit used for claim fees or holds: if Lead is cancelled by Flipcash or Customer before Partner visit, those fees/holds are <strong>refunded as wallet credit</strong> or bank payout on the next cycle.</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0 text-sm">2</span>
                  <span>Partners may withdraw available wallet balance only after <strong>Admin approval</strong>.</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0 text-sm">3</span>
                  <span>If Partner withdraws funds and later a chargeback or dispute arises, Flipcash reserves the right to <strong>recover funds or deduct from wallet</strong> per audit trail.</span>
                </li>
              </ul>
            </div>

            {/* 5.3 Payment Gateway Processing */}
            <div className="mb-6 bg-purple-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">5.3 Payment Gateway/Bank Processing</h3>
              <div className="space-y-3 text-gray-700">
                <p className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  <span>Refunds or withdrawals may be subject to payment gateway settlement times (typically <strong>2–10 business days</strong>) and regulatory holds (KYC, AML).</span>
                </p>
                <p className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  <span>Flipcash and its payment-partners are <strong>not liable for delays</strong> beyond standard banking timelines.</span>
                </p>
              </div>
            </div>

            {/* 5.4 No Refunds */}
            <div className="bg-red-50 border-l-4 border-red-600 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <XCircle className="w-6 h-6 text-red-600 mr-2" />
                5.4 No Refunds / Non-Eligibility
              </h3>
              <p className="text-gray-700 mb-3 font-semibold">Refunds will NOT be given if:</p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">✗</span>
                  <span>Customer cancels after Offer accepted without valid reason.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">✗</span>
                  <span>Partner fails to fulfil device purchase per conditions and Customer declines via normal flow (not fraud).</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">✗</span>
                  <span>Device condition changes materially and Customer accepts reduced offer.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">✗</span>
                  <span>Wallet withdrawal is processed and later the transaction is voided for regulatory/fraud reasons — Partner remains liable.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 6: Modification of Offers */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">6. Modification of Offers & Re-quotes</h2>
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-6 border-l-4 border-orange-500">
              <div className="space-y-4 text-gray-700">
                <p className="flex items-start">
                  <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0 text-sm">1</span>
                  <span>If device condition differs materially at onsite verification (e.g., accessories missing, body damage, IMEI lock), Partner may submit a <strong>re-quote</strong>.</span>
                </p>
                <p className="flex items-start">
                  <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0 text-sm">2</span>
                  <span>Customers may accept revised Offer or cancel. If canceled, refund/credit flows apply as per section 5.</span>
                </p>
                <p className="flex items-start">
                  <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0 text-sm">3</span>
                  <span>Once a re-quote is accepted, further cancellation/refund is governed by section 5 rules.</span>
                </p>
              </div>
            </div>
          </div>

          {/* Section 7: Force Majeure */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">7. Force Majeure & Platform Disruption</h2>
            </div>
            <div className="bg-red-50 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                In cases beyond our control (natural disaster, regulatory ban, PSP outage, etc.), Flipcash may cancel booked pickups or transactions.
              </p>
              <div className="bg-white rounded-lg p-4">
                <p className="text-gray-700">
                  In such cases, <strong>refunds or wallet credits are issued as soon as practicable</strong>. We are not liable for lost earnings due to such events.
                </p>
              </div>
            </div>
          </div>

          {/* Section 8: Withdrawal Terms */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">8. Withdrawal Terms (Partner)</h2>
            <div className="bg-blue-50 rounded-lg p-6">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0 font-bold">1</span>
                  <span>Partners may request withdrawal of wallet balance once status: <strong>Available and Admin Approved</strong>.</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0 font-bold">2</span>
                  <span>Withdrawals are processed subject to: <strong>KYC clearance, no unresolved claims/chargebacks, compliance checks</strong>.</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0 font-bold">3</span>
                  <span>If Partner uses wallet credit to claim leads, such advances are <strong>non-refundable</strong> except as per section 5.2.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 9: Disclaimer */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">9. Refund & Cancellation Disclaimer</h2>
            <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-6">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-2">⚠</span>
                  <span>Flipcash operates as a <strong>marketplace connecting Customers & Partners</strong>; transactions between them may be subject to external risk (device condition, buyer/seller behaviour).</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-2">⚠</span>
                  <span>Flipcash does <strong>not guarantee device resale value</strong>, or elimination of all risk.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-2">⚠</span>
                  <span>We are <strong>not liable for indirect losses</strong> (missed earnings, device value shortfall) post cancellation or refund.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 10: Appeal & Dispute */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Scale className="w-6 h-6 text-[#FEC925] mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">10. Appeal & Dispute Handling</h2>
            </div>
            <div className="bg-gradient-to-br from-gray-900 to-black text-white rounded-2xl p-8">
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="bg-[#FEC925] text-black rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-1 flex-shrink-0 font-bold">1</span>
                  <p className="text-white">If you disagree with a cancellation or refund decision, you may contact <a href="mailto:support@flipcash.in" className="text-[#FEC925] font-bold hover:text-yellow-300">support@flipcash.in</a> with your case details within <strong>30 days</strong> of the decision.</p>
                </div>
                <div className="flex items-start">
                  <span className="bg-[#FEC925] text-black rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-1 flex-shrink-0 font-bold">2</span>
                  <p className="text-white">Flipcash will review and respond within <strong>15 business days</strong>.</p>
                </div>
                <div className="flex items-start">
                  <span className="bg-[#FEC925] text-black rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-1 flex-shrink-0 font-bold">3</span>
                  <p className="text-white">Persistent unresolved issues may be directed to the <strong>grievance officer</strong> or outside mediation/arbitration under Terms & Conditions.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-gradient-to-br from-[#FEC925] to-yellow-400 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4 text-black">Need Help with Refunds or Cancellations?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-black/10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-black/80 mb-1">📧 Support Email:</p>
                <a href="mailto:support@flipcash.in" className="text-black font-bold hover:text-black/80">
                  support@flipcash.in
                </a>
              </div>
              <div className="bg-black/10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-black/80 mb-1">📞 Support Phone:</p>
                <a href="tel:+919654786218" className="text-black font-bold hover:text-black/80">
                  +91 96547 86218
                </a>
              </div>
            </div>
            <div className="mt-4 bg-black/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-black/80 mb-1">📍 Registered Office:</p>
              <p className="text-black font-medium text-sm">
                7th Floor, Unit No. 703, Palm Court, Mehrauli Gurgaon Road,<br />
                Sukhrali Chowk, Sector 16, Gurugram, Haryana – 122007
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h3 className="text-2xl font-bold mb-4">Questions About Our Policies?</h3>
          <p className="text-gray-300 mb-6">We're transparent about our refund and cancellation processes</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/contact')}
              className="bg-[#FEC925] text-black px-8 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors duration-300"
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

export default RefundPolicy;