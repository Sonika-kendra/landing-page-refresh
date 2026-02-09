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
  highlight?: boolean;
}

const features: Feature[] = [
  {
    icon: <FaMapMarkerAlt size={28} />,
    title: 'LOCATED IN THE CENTRE OF HATTON GARDEN',
  },
  {
    icon: <FaGem size={28} />,
    title: 'GIA GRADED DIAMONDS',
  },
  {
    icon: <FaPoundSign size={28} />,
    title: 'BEST VALUE IN LONDON',
  },
  {
    icon: <FaUsers size={28} />,
    title: 'FAMILY RUN BUSINESS SINCE 1982',
  },
  {
    icon: <FaTruck size={28} />,
    title: 'DELIVERED IN 2 WORKING DAYS',
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
            {feature.icon && <div className="mb-2 text-gray-700">{feature.icon}</div>}
            <h3
              className={`text-sm font-semibold leading-snug ${
                feature.highlight ? 'text-red-600' : 'text-gray-800'
              }`}
            >
              {feature.title}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SupportSection;
