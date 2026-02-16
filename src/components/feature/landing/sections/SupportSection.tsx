import React from 'react';
import {
  FaUsers,
  FaShieldAlt,
  FaBoxes,
  FaMapMarkerAlt,
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
    icon: <FaUsers size={28} />,
    title: 'Family-Run, Since 1973',
    subtitle: 'Your Partners in the Trade',
  },
  {
    icon: <FaShieldAlt size={28} />,
    title: 'Secure & Insured Delivery',
    subtitle: 'Dispatched within 2 working days.',
  },
  {
    icon: <FaBoxes size={28} />,
    title: 'Extensive Stock Available',
    subtitle: 'Certified & Uncertified diamonds and finished jewellery ready to supply.',
  },
  {
    icon: <FaMapMarkerAlt size={28} />,
    title: 'Established London Wholesaler',
    subtitle: 'One of the capital’s leading B2B diamond and jewellery suppliers.',
  },
  {
    icon: <FaUndoAlt size={28} />,
    title: 'Manufacturing Warranty',
    subtitle: 'With 30-Day Returns, T&Cs.',
    // title: 'Delivered in 2 working days',
    // highlight: true,
  },
];

const SupportSection = () => {
  return (
    <section className="py-16 section-ivory">
      <div className="max-w-full mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 text-center">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center px-4"
          >
            {feature.icon && (
              <div className="mb-4 text-gray-700">
                {feature.icon}
              </div>
            )}

            {/* Title */}
            <h3
              className={`text-base font-semibold leading-snug ${
                feature.highlight ? 'text-red-600' : 'text-gray-800'
              }`}
            >
              {feature.title}
            </h3>

            {/* Subtitle */}
            <span className="mt-2 text-sm text-gray-600 leading-relaxed max-w-xs">
              {feature.subtitle}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};



export default SupportSection;
