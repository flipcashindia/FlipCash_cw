import React from 'react';
// import flipcashLogo from '../../../public/flipcash_header_logo.png';
import AboutImg from '../../assets/BlogDefault.png';

const AboutUs: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      {/* <section className="bg-gradient-to-br from-[#FEC925] to-yellow-400 py-20">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-black mb-6">
            About FLIPCASH
          </h1>
          <p className="text-xl md:text-2xl text-black/80 max-w-3xl mx-auto font-medium">
            Your Trusted Partner for Smart, Sustainable Electronic Device Solutions
          </p>
        </div>
      </section> */}

      {/* Main About Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Text Content */}
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Welcome to FLIPCASH
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              FLIPCASH is a <strong className="text-[#FEC925]">customer-first platform</strong> built to simplify how people sell, and repair electronic gadgets. Whether you're upgrading your tech or decluttering your drawer, we make it effortless to trade in pre-owned smartphones, laptops, smartwatches, tablets, and more—from the comfort of your home.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              Our process is <strong className="text-[#FEC925]">transparent, fast, and designed around your convenience</strong>. With competitive pricing, doorstep pickup, and instant payments, FLIPCASH ensures that every transaction is smooth, secure, and rewarding.
            </p>
            <div className="bg-black text-[#FEC925] py-4 px-6 rounded-lg inline-block mt-6">
              <p className="text-2xl font-bold">FLIPCASH – Flip it. Cash it.</p>
            </div>
          </div>

          {/* Right Column: Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-lg overflow-hidden rounded-2xl shadow-xl group">
              <img
                src={AboutImg}
                alt="Electronic devices collection"
                className="w-full h-auto object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Mission Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <div className="bg-[#FEC925] rounded-full p-4 mr-4">
                  <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-gray-900">Our Mission</h3>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">
                We are on a mission to <strong>revolutionize the electronic device marketplace</strong> by creating a seamless, tech-enabled platform that prioritizes customer satisfaction, drives innovation, and promotes environmental responsibility.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed mt-4">
                By integrating cutting-edge technologies and circular economy principles, we aim to deliver lasting value—empowering users to make smarter choices while contributing to a more sustainable future.
              </p>
            </div>

            {/* Vision Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <div className="bg-[#FEC925] rounded-full p-4 mr-4">
                  <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-gray-900">Our Vision</h3>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">
                Our vision is to become <strong>India's leading platform</strong> for electronic gadget transactions and services—recognized for trust, innovation, and impact.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed mt-4">
                We strive to reshape the device ecosystem through intelligent, eco-conscious solutions that reduce e-waste, extend product lifecycles, and foster responsible consumption. Through every interaction, we aim to build a brand that stands for reliability, sustainability, and long-term value.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainability Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Image */}
          <div className="flex justify-center lg:justify-start order-2 lg:order-1">
            <div className="relative w-full max-w-lg">
              <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl p-12 shadow-xl">
                <svg className="w-full h-64 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Right Column: Content */}
          <div className="order-1 lg:order-2">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Our Commitment to Sustainability
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              At FLIPCASH, we believe <strong className="text-green-600">every device deserves a second life</strong>. Our platform actively supports the reuse and responsible recycling of electronics—reducing landfill waste and conserving valuable resources.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              From trade-ins to repairs, every service is designed to extend the life of your gadgets and minimize environmental impact.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              We're proud to be part of the <strong className="text-green-600">circular economy movement</strong>, helping customers make greener choices without compromising on convenience or value.
            </p>
          </div>
        </div>
      </section>

      {/* Innovation Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Content */}
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Innovation at Our Core
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              Technology is the backbone of our customer experience. We continuously explore and implement advanced solutions—from <strong className="text-blue-600">AI-powered pricing engines</strong> to <strong className="text-blue-600">IoT-enabled diagnostics</strong>—to make every interaction smarter, faster, and more intuitive.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              Our innovation isn't just about features—it's about creating meaningful, tech-driven experiences that build trust and deliver results.
            </p>
            
            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3 mt-6">
              <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-semibold">AI-Powered Pricing</span>
              <span className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full font-semibold">IoT Diagnostics</span>
              <span className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full font-semibold">Smart Analytics</span>
              <span className="bg-pink-100 text-pink-800 px-4 py-2 rounded-full font-semibold">Secure Transactions</span>
            </div>
          </div>

          {/* Right Column: Visual */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-lg">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-12 shadow-xl">
                <svg className="w-full h-64 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-20 bg-gradient-to-br from-[#FEC925] to-yellow-400">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
            Join Our Community
          </h2>
          <p className="text-lg md:text-xl text-black/80 max-w-3xl mx-auto leading-relaxed mb-4">
            FLIPCASH is more than a service—it's a <strong>movement toward smarter tech use and sustainable living</strong>. Join our growing network of customers, partners, and advocates who share a passion for innovation and environmental responsibility.
          </p>
          <p className="text-lg md:text-xl text-black/80 max-w-3xl mx-auto leading-relaxed mb-8">
            Together, we're building a vibrant ecosystem where devices are valued, reused, and repurposed—creating a cleaner, more connected future for all.
          </p>
          
          <button 
            onClick={() => window.location.href = '/contact'}
            className="bg-black text-[#FEC925] px-8 py-4 rounded-lg text-lg font-bold hover:bg-gray-900 transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
            Get Started Today
          </button>
        </div>
      </section>

      {/* Stats Section */}
      {/* <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <h3 className="text-4xl md:text-5xl font-bold text-[#FEC925] mb-2">10K+</h3>
              <p className="text-gray-400 text-lg">Happy Customers</p>
            </div>
            <div>
              <h3 className="text-4xl md:text-5xl font-bold text-[#FEC925] mb-2">50K+</h3>
              <p className="text-gray-400 text-lg">Devices Sold</p>
            </div>
            <div>
              <h3 className="text-4xl md:text-5xl font-bold text-[#FEC925] mb-2">100+</h3>
              <p className="text-gray-400 text-lg">Partner Stores</p>
            </div>
            <div>
              <h3 className="text-4xl md:text-5xl font-bold text-[#FEC925] mb-2">99%</h3>
              <p className="text-gray-400 text-lg">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default AboutUs;