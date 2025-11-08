import React from 'react';
import AboutImg from '../../assets/BlogDefault.png';

const AboutSection: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Column: Text Content */}
        <div>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            About Flipcash
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-4">
            Welcome to <strong className="text-red-600">Flipcash</strong>, your trusted platform to sell and buy old
            devices at the best value. We provide a simple, transparent, and
            reliable way for you to exchange your gadgets for instant cash or
            upgrade to a new device with ease.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed mb-4">
            Whether it's your <strong className="text-red-600">smartphone, laptop, tablet, or smartwatch</strong>,
            Flipcash ensures a quick, <strong className="text-red-600">safe, and hassle-free</strong> process. Our
            mission is to give your gadgets a second life while putting money
            back in your pocket.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed mb-4">
            With <strong className="text-red-600">doorstep pickup, instant payments, and fair pricing</strong>,
            Flipcash is the easiest way to sell your old devices or find a great
            deal on pre-owned gadgets.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            Thousands of users trust <strong className="text-red-600">Flipcash</strong> for their resale needs – join
            them today and make the most of your devices.
          </p>
        </div>

        {/* Right Column: Image */}
        <div className="flex justify-center lg:justify-end">
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl shadow-xl group">
            <img
              src= {AboutImg} // Placeholder image
              alt="Collection of old and new gadgets"
              className="w-full h-auto object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

