import React from 'react';
import {
  FaShieldAlt,
  FaClock,
  FaExchangeAlt,
  FaUndoAlt,
} from 'react-icons/fa';


interface Feature {
  icon?: React.ReactNode;
  title: string;
  subtitle: string;
  highlight?: boolean;
}

const features: Feature[] = [
  {
    icon: <FaShieldAlt size={28} />,
    title: 'Secure & Insured Delivery',
    subtitle: 'Dispatched within 2 working days.',
  },
  {
    icon: <FaClock size={28} />,
    title: 'Bespoke Services',
    subtitle: 'Pricing in 24-48hr',
  },
  {
    icon: <FaExchangeAlt size={28} />,
    title: 'Straightforward Returns',
    subtitle: '21-day hassle-free returns',
  },
  {
    icon: <FaUndoAlt size={28} />,
    title: 'Manufacturing Warranty',
    subtitle: 'With 30-Day Returns, T&Cs.',
  },
];

const SupportSection = () => {
  return (
    <section className="py-10 section-ivory">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-center items-center sm:items-start gap-30 sm:gap-40">
        {features.map((feature, idx) => (
          <div key={idx} className="flex flex-col items-center text-center">
            {feature.icon && (
              <div className="mb-2 text-gray-700">
                {feature.icon}
              </div>
            )}

            <h3
              className={`font-semibold text-base whitespace-nowrap ${
                feature.highlight ? 'text-red-600' : 'text-gray-800'
              }`}
            >
              {feature.title}
            </h3>

            <p className="text-gray-500 text-sm">{feature.subtitle}</p>
          </div>
        ))}
      </div>
    </section>
  );
};



export default SupportSection;
