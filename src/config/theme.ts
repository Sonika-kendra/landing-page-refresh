// ============================================
// Henig Diamonds - Global Theme Configuration
// ============================================
// All theme-related constants are centralized here.
// Modify this file to update the entire application theme.

export const brandConfig = {
  name: 'Henig Diamonds',
  tagline: 'A heritage of trust, innovation, and excellence in diamonds',
  foundedYear: 1973,
  contact: {
    phone: '+44 20 7404 0374',
    email: 'info@henigdiamonds.com',
    address: {
      line1: 'Premier House',
      line2: '12-13 Hatton Garden',
      city: 'London',
      postcode: 'EC1N 8AN',
    },
  },
  social: {
    instagram: 'https://instagram.com/henigdiamonds',
    facebook: 'https://facebook.com/henigdiamonds',
    linkedin: 'https://linkedin.com/company/henigdiamonds',
    twitter: 'https://x.com/HenigDiamonds',
    youtube: 'https://youtube.com/henigdiamonds',
  },
};

export const navigationLinks = [
  { label: 'Home', href: '/' },
  { label: 'Diamonds', href: '/diamonds' },
  { label: 'Jewellery', href: '/jewellery' },
  { label: 'Events & Blogs', href: '/blog' },
  { label: 'Contact us', href: '/contact' },
];

export const announcementBar = {
  enabled: true,
  messages: [
    'Christmas except for Castings. Order Castings by 22/12 (9:30AM).',
    'We close for Christmas Tuesday 23rd December.',
    'We will return Monday 6th January 2026.',
  ],
};

export const stats = [
  { value: '50,000+', label: 'Designs Manufactured' },
  { value: '85,000+', label: 'Production Capacity' },
  { value: '500+', label: 'Clients Globally' },
];

export const certifications = [
  { name: 'GIA', subtitle: '' },
  { name: 'IGI', subtitle: 'International Gemological Institute' },
  { name: 'HRD', subtitle: 'Antwerp' },
  { name: 'Institute of Gemmology', subtitle: '' },
];

export const jewellerAssociations = [
  { name: 'National Association of Jewellers', logo: '' },
  { name: 'Jewellers of Excellence', logo: '' },
  { name: 'British Jewellers Association', logo: '' },
  { name: 'London Diamond Bourse', logo: '' },
  { name: 'Responsible Jewellery Council', logo: '' },
];

export const footerLinks = {
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Why Henig', href: '/why-henig' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
  ],
  customerCare: [
    { label: 'FAQs', href: '/faq' },
    { label: 'How to Order', href: '/how-to-order' },
    { label: 'Terms & Conditions', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy' },
  ],
};

export const faqItems = [
  {
    question: 'Do you offer custom service, and how long does a custom piece take?',
    answer: 'Yes, we offer bespoke custom design services. Depending on the complexity of the piece, custom orders typically take 4-8 weeks from design approval to completion.',
  },
  {
    question: 'Is a deposit required to make an order?',
    answer: 'For custom pieces and special orders, we require a 50% deposit to begin work. Standard stock items can be purchased without a deposit.',
  },
  {
    question: 'Do you ship internationally?',
    answer: 'Yes, we ship worldwide. All international shipments are fully insured and require a signature upon delivery.',
  },
  {
    question: 'Can I see the diamond before it is set in the jewellery?',
    answer: 'Absolutely. We encourage our clients to view and approve their diamonds before setting. We can arrange viewing appointments at our Hatton Garden showroom.',
  },
  {
    question: 'Do you sell natural or lab-grown diamonds?',
    answer: 'We offer both natural and lab-grown diamonds. All our diamonds are certified by leading laboratories including GIA, IGI, and HRD.',
  },
  {
    question: 'What is your returns policy?',
    answer: 'We offer a 30-day return policy on all stock items in their original condition. Custom pieces are non-refundable but can be resized within 60 days at no extra cost.',
  },
];

export const features = [
  {
    icon: 'Palette',
    title: 'Handcrafted Designs',
    description: 'Design your jewellery in 3 simple steps and our experts will custom-craft it for you.',
  },
  {
    icon: 'MessageCircle',
    title: 'Expert Guidance',
    description: 'Chat with us online, on the phone or book an appointment in one of our showrooms.',
  },
  {
    icon: 'RotateCcw',
    title: 'Easy Returns & Resizing',
    description: 'Return your item in under 30 days, or have it resized for free in under 60 days.',
  },
  {
    icon: 'Shield',
    title: 'Sourcing With Care',
    description: 'Explore our collection of independently certified and conflict-free diamonds.',
  },
];

export const uspBanner = [
  { label: 'FREE Delivery', description: 'For all website customers' },
  { label: 'Same Day Dispatch', description: 'On orders placed before 2pm' },
  { label: 'Representatives', description: 'Covering the UK & Ireland' },
  { label: 'Customer Service', description: 'We pride ourselves on this' },
];
