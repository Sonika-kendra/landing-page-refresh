import React from 'react';
import {
  FaGem,
  FaBoxOpen,
  FaClock,
  FaUsers,
  FaHandsHelping,
} from 'react-icons/fa';


interface Feature {
  icon?: React.ReactNode;
  title: string;
  subtitle: string;
  highlight?: boolean;
}

const features: Feature[] = [
  {
    icon: <FaGem size={28} />,
    title: 'Award Winning Supplier',
    subtitle: 'Constantly improving quality',
  },
  {
    icon: <FaBoxOpen size={28} />,
    title: 'FREE Delivery',
    subtitle: 'For all website customers',
  },
  {
    icon: <FaClock size={28} />,
    title: 'Same Day Dispatch',
    subtitle: 'On orders placed before 2pm',
  },
  {
    icon: <FaUsers size={28} />,
    title: 'Representatives',
    subtitle: 'Covering the UK & Ireland',
  },
  {
    icon: <FaHandsHelping size={28} />,
    title: 'Customer Service',
    subtitle: 'We pride ourselves on this',
  },
];

const SupportSection = () => {
  return (
    <section className="py-10 section-ivory">
      <div className="max-w-7xl mx-auto px-2 flex flex-col sm:flex-row justify-center items-center sm:items-start gap-14 sm:gap-24">
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
