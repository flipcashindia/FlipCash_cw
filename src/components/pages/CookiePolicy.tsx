// src/pages/CookiePolicy.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Cookie, Shield, Smartphone, Settings, Mail, Phone, MapPin } from 'lucide-react';
// import flipcashLogo from '../../../public/flipcash_header_logo.png';

const CookiePolicy: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-900 to-orange-700 text-white py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-center mb-6">
            {/* <img 
              src={flipcashLogo} 
              alt="Flipcash Logo" 
              className="w-40 h-20 rounded-lg mr-4" 
            />
            <Cookie className="w-16 h-16 text-[#FEC925]" /> */}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-4">
            Cookie Policy
          </h1>
          <p className="text-center text-orange-100 text-lg max-w-3xl mx-auto">
            How we use cookies and similar technologies across our platforms
          </p>
          <p className="text-center text-orange-200 text-sm mt-4">
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
                <a href="tel:+919123228577" className="text-sm text-black/80 hover:text-black">
                  +91 9123228577
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
              <Cookie className="w-6 h-6 text-orange-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">1. Introduction</h2>
            </div>
            <div className="bg-orange-50 rounded-lg p-6 border-l-4 border-orange-600">
              <p className="text-gray-700 leading-relaxed mb-4">
                Flipcash ("we", "our", "us") uses cookies and similar technologies across all our platforms:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <p className="font-semibold text-gray-900 text-sm">🌐 Customer Website</p>
                  <p className="text-gray-600 text-xs">www.flipcash.in</p>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <p className="font-semibold text-gray-900 text-sm">📱 Customer Apps</p>
                  <p className="text-gray-600 text-xs">iOS & Android</p>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <p className="font-semibold text-gray-900 text-sm">🤝 Partner Website</p>
                  <p className="text-gray-600 text-xs">Partner portal</p>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <p className="font-semibold text-gray-900 text-sm">📲 Partner App</p>
                  <p className="text-gray-600 text-xs">Android</p>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <p className="font-semibold text-gray-900 text-sm">⚙️ Admin Panel</p>
                  <p className="text-gray-600 text-xs">Web (internal)</p>
                </div>
              </div>
              <p className="text-gray-700 mt-4">
                These technologies help us provide, analyse and improve the services including payments, device listings, partner workflows, wallet transactions and user experience.
              </p>
            </div>
          </div>

          {/* Section 2: What Are Cookies */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">2. What Are Cookies?</h2>
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                Cookies are small text files stored on your device when you use a website or app. They help identify you, remember preferences, enable login sessions, track usage and support secure transactions.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-3">⏱️</span>
                    <h4 className="font-bold text-gray-900">Session Cookies</h4>
                  </div>
                  <p className="text-gray-700 text-sm">Expire when you close the browser/app</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-3">💾</span>
                    <h4 className="font-bold text-gray-900">Persistent Cookies</h4>
                  </div>
                  <p className="text-gray-700 text-sm">Remain until deleted or reach expiry</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: How and Why */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">3. How and Why We Use Cookies</h2>
            <div className="bg-green-50 border-l-4 border-green-600 rounded-lg p-6">
              <p className="text-gray-700 mb-4 font-semibold">We use cookies and similar tracking tools to:</p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0 text-sm">✓</span>
                  <p className="text-gray-700"><strong>Enable core features:</strong> login, wallet access, booking, partner visits, offer flows.</p>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0 text-sm">✓</span>
                  <p className="text-gray-700"><strong>Secure sessions</strong> and protect against fraud (important for payment gateway approval).</p>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0 text-sm">✓</span>
                  <p className="text-gray-700"><strong>Remember your preferences</strong> (language, role: customer/partner, app theme).</p>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0 text-sm">✓</span>
                  <p className="text-gray-700"><strong>Analyse how our Platform is used</strong> for performance and improvement.</p>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0 text-sm">✓</span>
                  <p className="text-gray-700"><strong>Provide relevant offers,</strong> marketing campaigns, referral tracking.</p>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0 text-sm">✓</span>
                  <p className="text-gray-700"><strong>Ensure compliance</strong> with third-party services and store policies (Google/Apple).</p>
                </li>
              </ul>
              <div className="mt-4 bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded">
                <p className="text-gray-800 text-sm">
                  ⚠️ If you disable certain cookies, parts of the Platform (especially wallet/payout or partner lead claim modules) may not function fully.
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Platforms Covered */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">4. Platforms Covered & Scope</h2>
            <div className="bg-purple-50 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-white rounded-lg p-4 text-center">
                  <Smartphone className="w-10 h-10 text-purple-600 mx-auto mb-2" />
                  <h4 className="font-bold text-gray-900 mb-1">Customer</h4>
                  <p className="text-gray-600 text-sm">Website + iOS/Android apps</p>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <Shield className="w-10 h-10 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-bold text-gray-900 mb-1">Partner</h4>
                  <p className="text-gray-600 text-sm">Website + Android app</p>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <Settings className="w-10 h-10 text-green-600 mx-auto mb-2" />
                  <h4 className="font-bold text-gray-900 mb-1">Admin</h4>
                  <p className="text-gray-600 text-sm">Web Panel (internal)</p>
                </div>
              </div>
              <p className="text-gray-700 text-sm">
                Regardless of device/OS, the same cookie rules apply. Mobile apps may also use local storage, device identifiers, SDKs; we treat these similarly to cookies in this policy.
              </p>
            </div>
          </div>

          {/* Section 5: Types of Cookies */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">5. Types of Cookies We Use</h2>
            
            {/* A. Essential Cookies */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">A</span>
                Essential / Strictly Necessary Cookies
              </h3>
              <p className="text-gray-700 mb-4 text-sm">
                These are required to make the Platform work correctly (especially for payments, wallet, KYC). They cannot be disabled via our cookie banner.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-red-600 text-white">
                      <th className="p-3 text-left font-semibold">Name</th>
                      <th className="p-3 text-left font-semibold">Purpose</th>
                      <th className="p-3 text-left font-semibold">Retention</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-3 font-mono text-sm">auth_token</td>
                      <td className="p-3 text-sm">Maintains user/partner login session</td>
                      <td className="p-3 text-sm">Session</td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-3 font-mono text-sm">csrf_session_id</td>
                      <td className="p-3 text-sm">CSRF protection for forms/transactions</td>
                      <td className="p-3 text-sm">Session</td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-3 font-mono text-sm">_ga</td>
                      <td className="p-3 text-sm">Google Analytics unique visitor ID</td>
                      <td className="p-3 text-sm">2 years</td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-3 font-mono text-sm">_gid</td>
                      <td className="p-3 text-sm">Google Analytics session ID</td>
                      <td className="p-3 text-sm">1 day</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="p-3 font-mono text-sm">flipcash_user_session</td>
                      <td className="p-3 text-sm">Stores session info for platform role</td>
                      <td className="p-3 text-sm">Session</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* B. Functional Cookies */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">B</span>
                Functional Cookies
              </h3>
              <p className="text-gray-700 mb-4 text-sm">
                Help with features and remembering preferences.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-blue-600 text-white">
                      <th className="p-3 text-left font-semibold">Name</th>
                      <th className="p-3 text-left font-semibold">Purpose</th>
                      <th className="p-3 text-left font-semibold">Retention</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-3 font-mono text-sm">lang</td>
                      <td className="p-3 text-sm">Stores preferred language</td>
                      <td className="p-3 text-sm">Session</td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-3 font-mono text-sm">theme_pref</td>
                      <td className="p-3 text-sm">Stores light/dark mode preference</td>
                      <td className="p-3 text-sm">6 months</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="p-3 font-mono text-sm">last_role</td>
                      <td className="p-3 text-sm">Remembers whether you are Customer/Partner</td>
                      <td className="p-3 text-sm">3 months</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* C. Performance & Analytics */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">C</span>
                Performance & Analytics Cookies
              </h3>
              <p className="text-gray-700 mb-4 text-sm">
                Used for measuring user behaviour, improving app/website performance, supporting app store compliance (analytics SDKs).
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-green-600 text-white">
                      <th className="p-3 text-left font-semibold">Name</th>
                      <th className="p-3 text-left font-semibold">Purpose</th>
                      <th className="p-3 text-left font-semibold">Retention</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-3 font-mono text-sm">_fbp</td>
                      <td className="p-3 text-sm">Facebook Pixel for ad tracking</td>
                      <td className="p-3 text-sm">3 months</td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-3 font-mono text-sm">AA003</td>
                      <td className="p-3 text-sm">Audience tracking across visits</td>
                      <td className="p-3 text-sm">3 months</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="p-3 font-mono text-sm">ads/ga-audiences</td>
                      <td className="p-3 text-sm">Google Ads remarketing cookie</td>
                      <td className="p-3 text-sm">Session</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* D. Advertising */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">D</span>
                Advertising & Tracking Cookies
              </h3>
              <p className="text-gray-700 mb-4 text-sm">
                Used for marketing, affiliate/referral tracking, social media integrations.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-purple-600 text-white">
                      <th className="p-3 text-left font-semibold">Name</th>
                      <th className="p-3 text-left font-semibold">Purpose</th>
                      <th className="p-3 text-left font-semibold">Retention</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-3 font-mono text-sm">IDE</td>
                      <td className="p-3 text-sm">Google DoubleClick – ad performance</td>
                      <td className="p-3 text-sm">1 year</td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-3 font-mono text-sm">_widgetsettings</td>
                      <td className="p-3 text-sm">Stores ad widget configurations</td>
                      <td className="p-3 text-sm">Persistent</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="p-3 font-mono text-sm">GPS</td>
                      <td className="p-3 text-sm">Used for mobile video ad delivery</td>
                      <td className="p-3 text-sm">1 day</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Section 6: Third-Party */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">6. Third-Party Cookies & SDKs</h2>
            <div className="bg-blue-50 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                We integrate with third-party services:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                  <p className="text-2xl mb-1">💳</p>
                  <p className="text-gray-900 font-semibold text-sm">Payments</p>
                  <p className="text-gray-600 text-xs">Razorpay, Cashfree</p>
                </div>
                <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                  <p className="text-2xl mb-1">📊</p>
                  <p className="text-gray-900 font-semibold text-sm">Analytics</p>
                  <p className="text-gray-600 text-xs">Firebase, Google</p>
                </div>
                <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                  <p className="text-2xl mb-1">📱</p>
                  <p className="text-gray-900 font-semibold text-sm">SMS/OTP</p>
                  <p className="text-gray-600 text-xs">MSG91</p>
                </div>
                <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                  <p className="text-2xl mb-1">🗺️</p>
                  <p className="text-gray-900 font-semibold text-sm">Maps</p>
                  <p className="text-gray-600 text-xs">Google Maps</p>
                </div>
              </div>
              <p className="text-gray-700 mt-4 text-sm">
                Flipcash does not control third-party cookie policies, but ensures they operate under contract and comply with applicable laws and store/PSP compliance.
              </p>
            </div>
          </div>

          {/* Section 7: Mobile App Tracking */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Smartphone className="w-6 h-6 text-[#FEC925] mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">7. Mobile App Tracking</h2>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
              <p className="text-gray-700 mb-4">In our mobile apps (iOS & Android) we may use:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-white rounded-lg p-3 flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  <span className="text-gray-700 text-sm">Device identifiers (IDFA, IDFV, Android Advertising ID)</span>
                </div>
                <div className="bg-white rounded-lg p-3 flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  <span className="text-gray-700 text-sm">Local storage for tokens, preferences</span>
                </div>
                <div className="bg-white rounded-lg p-3 flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  <span className="text-gray-700 text-sm">Push notification tokens</span>
                </div>
                <div className="bg-white rounded-lg p-3 flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  <span className="text-gray-700 text-sm">SDKs for analytics/crash reporting</span>
                </div>
              </div>
              <div className="mt-4 bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded">
                <p className="text-gray-800 text-sm">
                  📱 These will be disclosed in the app's <strong>Data Safety / Privacy labels</strong> required by Google Play & Apple App Store. Users can revoke permissions in device settings.
                </p>
              </div>
            </div>
          </div>

          {/* Section 8: Managing Cookies */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Settings className="w-6 h-6 text-[#FEC925] mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">8. Managing and Controlling Cookies</h2>
            </div>

            {/* Website */}
            <div className="mb-6 bg-green-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="text-2xl mr-3">🌐</span>
                Website
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span>On the first visit you'll see a banner: <strong>Accept All, Reject Non-Essential, Manage Settings</strong>.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span>You can change preferences at any time via a <strong>"Cookie settings"</strong> link in the footer.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span>You may disable cookies entirely via browser settings — note that doing so may disrupt wallet, login or transaction features.</span>
                </li>
              </ul>
            </div>

            {/* Mobile Apps */}
            <div className="mb-6 bg-blue-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="text-2xl mr-3">📱</span>
                Mobile Apps
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Go to: <strong>Settings → Privacy → Cookie/Tracking Preferences</strong>.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>You can opt out of analytics/tracking but essential cookies/utilities will still be required for core functionality.</span>
                </li>
              </ul>
            </div>

            {/* Browser Instructions */}
            <div className="bg-purple-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="text-2xl mr-3">🔧</span>
                Browser Instructions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-white rounded-lg p-3">
                  <p className="font-semibold text-gray-900 mb-1 text-sm">Chrome</p>
                  <p className="text-gray-600 text-xs">Settings → Privacy & security → Cookies</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="font-semibold text-gray-900 mb-1 text-sm">Safari</p>
                  <p className="text-gray-600 text-xs">Preferences → Privacy → Manage website data</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="font-semibold text-gray-900 mb-1 text-sm">Edge</p>
                  <p className="text-gray-600 text-xs">Settings → Cookies and site permissions</p>
                </div>
              </div>
              <p className="text-gray-700 text-sm mt-4">
                ⚠️ Blocking cookies doesn't delete existing ones — you must clear them manually.
              </p>
            </div>
          </div>

          {/* Section 9: Legal Basis */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Shield className="w-6 h-6 text-[#FEC925] mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">9. Legal Basis & Consent</h2>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                Under the <strong>Digital Personal Data Protection Act, 2023</strong> and other applicable laws:
              </p>
              <div className="space-y-3">
                <div className="bg-white rounded-lg p-4">
                  <p className="font-semibold text-gray-900 mb-2">🔒 Essential cookies</p>
                  <p className="text-gray-700 text-sm">Processed on basis of <strong>legitimate interest</strong> (platform operations, security)</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="font-semibold text-gray-900 mb-2">📊 Analytics, functional cookies</p>
                  <p className="text-gray-700 text-sm">Processed on <strong>legitimate interest</strong> (improvement, performance)</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="font-semibold text-gray-900 mb-2">📢 Advertising cookies</p>
                  <p className="text-gray-700 text-sm">Processed on <strong>consent</strong> (you may withdraw at any time)</p>
                </div>
              </div>
              <p className="text-gray-700 text-sm mt-4">
                We store your consent records in compliance with PSP/app store audit requirements for payments and wallets.
              </p>
            </div>
          </div>

          {/* Section 10: Data Retention */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">10. Data Retention & Deletion</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-5">
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-2">⏱️</span>
                  <h4 className="font-bold text-gray-900">Session Cookies</h4>
                </div>
                <p className="text-gray-700 text-sm">Expire when you close the browser/app</p>
              </div>
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-5">
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-2">📅</span>
                  <h4 className="font-bold text-gray-900">Persistent Cookies</h4>
                </div>
                <p className="text-gray-700 text-sm">Range between 1 day – 2 years depending on purpose</p>
              </div>
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-5">
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-2">📊</span>
                  <h4 className="font-bold text-gray-900">Anonymised Data</h4>
                </div>
                <p className="text-gray-700 text-sm">May be retained longer for analytics</p>
              </div>
            </div>
            <p className="text-gray-700 text-sm mt-4">
              After expiry/withdrawal, cookies are deleted or anonymised in accordance with our Privacy Policy retention rules.
            </p>
          </div>

          {/* Sections 11-13: Condensed */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">11. Links to Other Sites / External Cookies</h2>
              <p className="text-gray-700">
                Our Platform may link to external sites (e.g., payment gateways, social networks). Their cookie policies apply once you leave our domain/app. We are not responsible for external tracking.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">12. Updates to This Cookie Policy</h2>
              <p className="text-gray-700">
                We may update this policy as our Platform evolves, new features roll out, or regulations change. We will update the "Last Updated" date and publish the new version. Your continued use means you accept the changes.
              </p>
            </div>
          </div>

          {/* Contact & Grievance Section */}
          <div className="mt-12 bg-gradient-to-br from-gray-900 to-black text-white rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6 text-[#FEC925]">13. Contact & Grievance</h2>
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
                  <a href="tel:+919123228577" className="text-[#FEC925] hover:text-yellow-300">
                    +91 9123228577
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
              <p className="text-gray-300 text-sm mt-4">
                You can contact us for cookie preferences, consent withdrawal, or complaints about tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-[#FEC925]">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h3 className="text-2xl font-bold text-black mb-4">Questions About Cookies?</h3>
          <p className="text-black/80 mb-6">Manage your cookie preferences or reach out for help</p>
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

export default CookiePolicy;