import React from 'react';
import {
  FaMapMarkerAlt,
  FaGem,
  FaPoundSign,
  FaUsers,
  FaTruck,
} from 'react-icons/fa';

interface Feature {
  icon?: React.ReactNode;
  title: string;
  subtitle: string;
  highlight?: boolean;
}

const features: Feature[] = [
  {
    icon: <FaMapMarkerAlt size={28} />,
    title: 'Family-Run, Since 1973',
    subtitle: 'Your Partners in the Trade',
  },
  {
    icon: <FaGem size={28} />,
    title: 'Secure & Insured Delivery',
    subtitle: 'Dispatched within 2 working days.',
  },
  {
    icon: <FaPoundSign size={28} />,
    title: 'Extensive Stock Available',
    subtitle: 'Certified & Uncertified diamonds and finished jewellery ready to supply.',
  },
  {
    icon: <FaUsers size={28} />,
    title: 'Established London Wholesaler',
    subtitle: 'One of the capital’s leading B2B diamond and jewellery suppliers.',
  },
  {
    icon: <FaTruck size={28} />,
    title: 'Manufacturing Warranty',
    subtitle: 'With 30-Day Returns, T&Cs.',
    // title: 'Delivered in 2 working days',
    // highlight: true,
  },
];

const SupportSection = () => {
  return (
    <section className="py-12 section-ivory">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 text-center">
        {features.map((feature, idx) => (
          <div key={idx} className="flex flex-col items-center">
            {feature.icon && (
              <div className="mb-3 text-gray-700">
                {feature.icon}
              </div>
            )}

            {/* Title */}
            <h3
              className={`text-sm font-semibold leading-snug ${
                feature.highlight ? 'text-red-600' : 'text-gray-800'
              }`}
            >
              {feature.title}
            </h3>

            {/* Subtitle (Styled Span) */}
            <span className="mt-1 text-xs text-gray-600 font-normal leading-relaxed">
              {feature.subtitle}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};


export default SupportSection;
