import React from "react";
import { ArrowRight } from "lucide-react";
import AppDemoImg from "../../assets/AppDemoImg.png";

// Image import
const appPhoneMockup = AppDemoImg;

const DownloadAppBanner: React.FC = () => {
  return (
    <section
      className="py-16"
      style={{
        background: "linear-gradient(135deg, #fce4ec 0%, #f3e5f5 40%, #ffffff 100%)",
      }}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          {/* --- Text Content --- */}
          <div className="md:w-1/2 text-center md:text-left">
            <span className="text-pink-600 font-semibold text-sm uppercase">
              Get Started Faster
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3 mb-6">
              Sell or Buy on the Go
            </h2>
            <p className="text-lg text-gray-700 mb-8 max-w-lg mx-auto md:mx-0">
              Download the Flipcash app to get instant quotes, manage your
              listings, and track your orders — all from your phone.
            </p>
            <a
              href="#"
              className="inline-flex items-center justify-center px-8 py-3 
                         border border-transparent text-base font-medium rounded-full shadow-lg 
                         text-white bg-red-600 hover:bg-red-700 
                         transition-transform duration-300 hover:scale-105"
            >
              Download Now
              <ArrowRight size={20} className="ml-2" />
            </a>
          </div>

          {/* --- Image Content --- */}
          <div className="md:w-1/2 flex justify-center">
            <img
              src={appPhoneMockup}
              alt="Flipcash App Mockup"
              className="w-90 h-90 md:w-100 md:h-100 object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadAppBanner;
