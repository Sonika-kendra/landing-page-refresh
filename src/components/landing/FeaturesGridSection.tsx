import React from 'react';

interface Feature {
  icon?: React.ReactNode;
  title: string;
  highlight?: boolean;
}

// Pixel-perfect icons based on your screenshot
const features: Feature[] = [
  {
    // Big Ben
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2 L12 22" />
        <path d="M9 22 H15" />
        <path d="M9 18 H15" />
        <path d="M11 2 L12 0 L13 2" />
      </svg>
    ),
    title: 'LOCATED IN THE CENTRE OF HATTON GARDEN',
  },
  {
    // Diamond
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2 L22 12 L12 22 L2 12 Z" />
        <path d="M12 2 L12 22" />
        <path d="M2 12 L22 12" />
      </svg>
    ),
    title: 'GIA GRADED DIAMONDS',
  },
  {
    // Pound coin
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8 C10 8 10 12 12 12 C14 12 14 16 12 16" />
      </svg>
    ),
    title: 'BEST VALUE IN LONDON',
  },
  {
    // Family
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6" cy="8" r="2" />
        <circle cx="18" cy="8" r="2" />
        <circle cx="12" cy="16" r="2" />
        <path d="M6 10 V14" />
        <path d="M18 10 V14" />
        <path d="M12 18 V20" />
      </svg>
    ),
    title: 'FAMILY RUN BUSINESS SINCE 1982',
  },
  // {
  //   // Red text only
  //   title: 'Delivered in 2 working days',
  //   highlight: true,
  // },
];

const FeaturesGridSection = () => {
  return (
    <section className="py-12 bg-white">
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

export default FeaturesGridSection;
