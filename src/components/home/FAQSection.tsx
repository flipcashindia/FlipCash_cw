// src/pages/FAQ.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Search, Phone, Mail, MessageCircle } from 'lucide-react';
// import flipcashLogo from '../../../public/flipcash_header_logo.png';

interface FAQItem {
  question: string;
  answer: string | string[];
  category: string;
}

const faqData: FAQItem[] = [
  {
    question: "How do I sell my old device on FLIPCASH?",
    answer: [
      "Selling your device is simple and convenient via our app or website:",
      "• Sign up or log in using your mobile number and OTP.",
      "• Select your device and answer a few questions about its condition.",
      "• View your device's estimated value.",
      "• Schedule a pickup and enter your address and preferred payment method to complete the process."
    ],
    category: "Getting Started"
  },
  {
    question: "How is the price of my device determined?",
    answer: "We evaluate your device based on its current condition and prevailing market value. FLIPCASH guarantees competitive and transparent pricing.",
    category: "Pricing"
  },
  {
    question: "Can I sell a damaged device?",
    answer: "Absolutely. Damaged devices are accepted. The final quote will be provided after doorstep diagnosis by our technician.",
    category: "Device Condition"
  },
  {
    question: "Do you accept dead or broken phones?",
    answer: "Yes, we accept dead or broken mobile phones. However, the condition may affect the final quoted price.",
    category: "Device Condition"
  },
  {
    question: "Is there a pickup charge?",
    answer: "No. FLIPCASH offers free pickup with no hidden fees, no processing charges, and no platform costs.",
    category: "Pickup & Delivery"
  },
  {
    question: "What if my pickup is delayed?",
    answer: "While delays are rare, they may occur due to traffic, weather, or other unforeseen issues. We'll keep you updated in real time on your pickup status.",
    category: "Pickup & Delivery"
  },
  {
    question: "What happens if the device condition doesn't match during pickup?",
    answer: "Our executive will verify the device condition. If discrepancies are found, a revised quote will be generated. Upon your approval, payment will be made instantly.",
    category: "Verification"
  },
  {
    question: "Should I delete my data before selling?",
    answer: "We recommend removing all personal data, SIM cards, and memory cards. If not done, our technician will securely wipe your device before proceeding.",
    category: "Data & Security"
  },
  {
    question: "What if my phone is under warranty but I've lost the invoice?",
    answer: "Without a valid invoice, the device will be considered over one year old, and priced accordingly. An invoice is mandatory to claim warranty benefits.",
    category: "Warranty & Documents"
  },
  {
    question: "What happens to my old phone after pickup?",
    answer: "Once picked up and data is wiped, your device is responsibly resold to verified dealers, retailers, or distributors.",
    category: "After Sale"
  },
  {
    question: "Are there any phone models you don't buy?",
    answer: "FLIPCASH accepts almost all phone models. You can view the complete list of eligible devices on our app or website.",
    category: "Device Eligibility"
  },
  {
    question: "How long does it take to arrange a pickup?",
    answer: "Pickup is typically scheduled within 24–48 hours of order placement (excluding Sundays and public holidays). Express pickup may be available on request.",
    category: "Pickup & Delivery"
  },
  {
    question: "When will I receive payment?",
    answer: "Payment is made instantly by our executive after the device is inspected and approved.",
    category: "Payment"
  },
  {
    question: "Is there any liability after payment is made?",
    answer: "Once the device is picked up and payment is completed, FLIPCASH assumes full responsibility for the transaction.",
    category: "After Sale"
  },
  {
    question: "Can I reschedule my pickup?",
    answer: "Yes, you can reschedule your pickup in case of unforeseen circumstances. Please notify us in advance.",
    category: "Pickup & Delivery"
  },
  {
    question: "What types of devices can I sell?",
    answer: [
      "We accept a wide range of gadgets including:",
      "• Mobile phones",
      "• Tablets",
      "• Laptops",
      "• Smartwatches",
      "• Earphones",
      "• Cameras",
      "• PlayStations",
      "Check our app or website for the full list."
    ],
    category: "Device Eligibility"
  },
  {
    question: "Can I sell a device bought on EMI?",
    answer: "Yes, provided all installments are cleared. A No Objection Certificate (NOC) from the finance provider is required at the time of pickup.",
    category: "Special Cases"
  },
  {
    question: "How can I contact FLIPCASH for support?",
    answer: [
      "You can reach us:",
      "📞 Phone: +91 96547 86218 / +91 91232 28577",
      "📧 Email: support@flipcash.in",
      "Available on working days from 10 AM to 7 PM."
    ],
    category: "Support"
  }
];

const FAQAccordion: React.FC<{ item: FAQItem; index: number; isOpen: boolean; toggle: () => void }> = ({ 
  item, 
  index, 
  isOpen, 
  toggle 
}) => {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
      <button
        onClick={toggle}
        className="w-full flex items-center justify-between p-5 bg-white hover:bg-gray-50 transition-colors duration-200"
      >
        <div className="flex items-start text-left flex-1">
          <span className="bg-[#FEC925] text-black font-bold rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
            {index + 1}
          </span>
          <h3 className="font-semibold text-gray-900 text-lg pr-4">{item.question}</h3>
        </div>
        <ChevronDown 
          className={`w-6 h-6 text-[#FEC925] transition-transform duration-200 flex-shrink-0 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <div className="p-5 pt-0 pl-17 bg-gray-50">
          {Array.isArray(item.answer) ? (
            <div className="space-y-2">
              {item.answer.map((line, idx) => (
                <p key={idx} className="text-gray-700 leading-relaxed">
                  {line}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-gray-700 leading-relaxed">{item.answer}</p>
          )}
        </div>
      </div>
    </div>
  );
};

const FAQ: React.FC = () => {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(faqData.map(item => item.category)))];

  const filteredFAQs = faqData.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (typeof item.answer === 'string' 
                           ? item.answer.toLowerCase().includes(searchQuery.toLowerCase())
                           : item.answer.join(' ').toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#FEC925] to-yellow-400 py-16">
        <div className="container mx-auto px-4 md:px-6">
          {/* <div className="flex items-center justify-center mb-6">
            <img 
              src={flipcashLogo} 
              alt="Flipcash Logo" 
              className="w-40 h-20 rounded-lg mr-4" 
            />
            <HelpCircle className="w-16 h-16 text-black" />
          </div> */}
          <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-4 text-black">
            Frequently Asked Questions
          </h1>
          <p className="text-center text-black/80 text-lg max-w-3xl mx-auto">
            Find quick answers to common questions about selling your devices on FLIPCASH
          </p>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-lg border-2 border-gray-200 focus:border-[#FEC925] focus:outline-none text-gray-900 placeholder-gray-400"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-[#FEC925] text-black shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Results Count */}
          {searchQuery && (
            <p className="mt-4 text-gray-600">
              Found <strong>{filteredFAQs.length}</strong> result{filteredFAQs.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          {filteredFAQs.length > 0 ? (
            <div className="space-y-4">
              {filteredFAQs.map((item, index) => (
                <FAQAccordion
                  key={index}
                  item={item}
                  index={index}
                  isOpen={openIndex === index}
                  toggle={() => setOpenIndex(openIndex === index ? null : index)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search or filter to find what you're looking for
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="bg-[#FEC925] text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Still Have Questions Section */}
      <section className="py-16 bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Still Have Questions?</h2>
          <p className="text-gray-300 text-lg mb-8">
            Our support team is here to help you with any queries
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Phone Support */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-colors">
              <Phone className="w-12 h-12 text-[#FEC925] mx-auto mb-4" />
              <h3 className="font-bold text-xl mb-2">Phone Support</h3>
              <p className="text-gray-300 text-sm mb-3">Available 10 AM - 7 PM</p>
              <a 
                href="tel:+919654786218" 
                className="text-[#FEC925] hover:text-yellow-300 font-semibold block"
              >
                +91 96547 86218
              </a>
              <a 
                href="tel:+919123228577" 
                className="text-[#FEC925] hover:text-yellow-300 font-semibold block"
              >
                +91 91232 28577
              </a>
            </div>

            {/* Email Support */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-colors">
              <Mail className="w-12 h-12 text-[#FEC925] mx-auto mb-4" />
              <h3 className="font-bold text-xl mb-2">Email Support</h3>
              <p className="text-gray-300 text-sm mb-3">Get help via email</p>
              <a 
                href="mailto:support@flipcash.in" 
                className="text-[#FEC925] hover:text-yellow-300 font-semibold"
              >
                support@flipcash.in
              </a>
            </div>

            {/* Live Chat */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-colors">
              <MessageCircle className="w-12 h-12 text-[#FEC925] mx-auto mb-4" />
              <h3 className="font-bold text-xl mb-2">Live Chat</h3>
              <p className="text-gray-300 text-sm mb-3">Chat with our team</p>
              <button
                onClick={() => navigate('/contact')}
                className="text-[#FEC925] hover:text-yellow-300 font-semibold"
              >
                Start Chat
              </button>
            </div>
          </div>

          <button
            onClick={() => navigate('/contact')}
            className="bg-[#FEC925] text-black px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-400 transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
            Contact Support Team
          </button>
        </div>
      </section>

      {/* Quick Links Section */}
      {/* <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Explore More</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/about')}
              className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300 border border-gray-200"
            >
              About Us
            </button>
            <button
              onClick={() => navigate('/terms')}
              className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300 border border-gray-200"
            >
              Terms & Conditions
            </button>
            <button
              onClick={() => navigate('/privacy')}
              className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300 border border-gray-200"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-[#FEC925] text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors duration-300"
            >
              Back to Home
            </button>
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default FAQ;