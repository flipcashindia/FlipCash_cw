import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <motion.button
        className={`flex justify-between items-center w-full text-left py-4 px-6 md:px-8 text-lg font-semibold transition-colors duration-200 
                    ${isOpen ? 'bg-blue-50 text-blue-800' : 'hover:bg-gray-50'}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span>{question}</span>
        <motion.span
          initial={false}
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={24} />
        </motion.span>
      </motion.button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden bg-blue-50"
          >
            <p className="px-6 md:px-8 pb-4 text-gray-700 text-base leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQSection: React.FC = () => {
  const faqs = [
    {
      question: "How can I sell products on Flipcash?",
      answer: "To sell products on Flipcash, simply create an account, and then you can list your products under the 'Sell Product' section. You will need to upload product images, write a description, set a price, and specify whether the product is new or used."
    },
    {
      question: "How do I buy products on Flipcash?",
      answer: "To buy products, browse our categories or use the search bar to find what you're looking for. Once you find an item you like, add it to your cart and proceed to checkout. We offer secure payment options and various shipping methods."
    },
    {
      question: "How do I get paid when I sell a product?",
      answer: "Once your product is sold and the transaction is complete, payments are processed securely through our platform. You can choose to receive your earnings via bank transfer, digital wallet, or other supported payment methods, typically within 1-3 business days after product delivery and buyer confirmation."
    },
    {
      question: "What is Flipcash's return policy?",
      answer: "Flipcash offers a 30-day return policy for most items, provided they are returned in the condition they were received. Some exclusions may apply, such as final sale items or products with specific seller conditions. Please review the full return policy on our website for details."
    },
    {
      question:"How can I contact customer support?",
      answer: "You can contact our customer support team through multiple channels: visit our 'Contact Us' page for a contact form, email us directly at support@flipcash.com, or call our helpline at (64) 8342 1245 during business hours. We're here to help!"
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
          Frequently Asked Questions
        </h2>
        <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;

