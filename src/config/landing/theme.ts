// ============================================
// Henig Diamonds - Global Theme Configuration
// ============================================
// All theme-related constants are centralized here.
// Modify this file to update the entire application theme.

import { websiteUrlConfig } from "../config";
import { Diamond, Gem, Award, Users } from 'lucide-react';
// Navigation category images
import ring from '@/assets/jewellery/category/ring.png';
import bracelet from '@/assets/jewellery/category/Bracelet-1.png';
import earrings from '@/assets/jewellery/category/earrings.png';
import necklace from '@/assets/jewellery/category/33cb8070-9fd3-4fbe-8cf7-838a1e473ad3.png';
import diamondsCategory from '@/assets/diamonds/diamonds-category.jpg';
import labGrownDiamond from '@/assets/diamonds/lab-grown-diamond.jpg';

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
    linkedin: 'https://uk.linkedin.com/company/henig-diamonds',
    instagram: 'https://www.instagram.com/henigdiamonds?igsh=cjNyZHFkcDZ2enVi&utm_source=qr',
    whatsApp: 'https://whatsapp.com/channel/0029VbCFMLYE50Ugv30Kw72s',
    facebook: 'https://facebook.com/henigdiamonds',
    twitter: 'https://x.com/HenigDiamonds',
    youtube: 'https://youtube.com/henigdiamonds',
  },
};

export const navigationLinks = [
  { label: 'Home', href: websiteUrlConfig.Home },
  {
    label: 'Diamonds',
    href: websiteUrlConfig.Diamonds.Home,
    megaMenu: true,
    categories: [
      {
        title: 'By Type',
        showAll: {
          label: 'Show all',
          href: websiteUrlConfig.Diamonds.All,
        },
        links: [
          { label: 'Natural Diamonds', href: websiteUrlConfig.Diamonds.All, image: diamondsCategory },
          { label: 'Lab-Grown Diamonds', href: websiteUrlConfig.Diamonds.All, image: labGrownDiamond },
        ],
      },
      {
        title: 'By Shape',
        links: [
          { label: 'Round Brilliant', href: websiteUrlConfig.Diamonds.All },
          { label: 'Princess Cut', href: websiteUrlConfig.Diamonds.All },
          { label: 'Oval', href: websiteUrlConfig.Diamonds.All },
          { label: 'Emerald Cut', href: websiteUrlConfig.Diamonds.All },
          { label: 'Cushion', href: websiteUrlConfig.Diamonds.All },
          { label: 'Pear', href: websiteUrlConfig.Diamonds.All },
          { label: 'Marquise', href: websiteUrlConfig.Diamonds.All },
          { label: 'Radiant', href: websiteUrlConfig.Diamonds.All },
        ],
      },
      {
        title: 'By Carat',
        links: [
          { label: '0.25 - 0.50 ct', href: websiteUrlConfig.Diamonds.All },
          { label: '0.50 - 1.00 ct', href: websiteUrlConfig.Diamonds.All },
          { label: '1.00 - 2.00 ct', href: websiteUrlConfig.Diamonds.All },
          { label: '2.00+ ct', href: websiteUrlConfig.Diamonds.All },
        ],
      },
      {
        title: 'Pairs & Sets',
        links: [
          { label: 'Matched Pairs', href: websiteUrlConfig.Diamonds.All },
          { label: 'Side Stones', href: websiteUrlConfig.Diamonds.All },
          { label: 'Melee Diamonds', href: websiteUrlConfig.Diamonds.All },
        ],
      },
    ],
  },
  {  
    label: 'Jewellery',
    href: websiteUrlConfig.Jewellery.Home,
    megaMenu: true,
    categories: [
      {
        title: 'By Category',
        showAll: {
          label: 'Show all',
          href: websiteUrlConfig.Jewellery.Home,
        },
        links: [
          { label: 'Rings', href: websiteUrlConfig.Jewellery.Rings, image: ring },
          { label: 'Earrings', href: websiteUrlConfig.Jewellery.Earrings, image: earrings },
          { label: 'Bracelets', href: websiteUrlConfig.Jewellery.Bracelets, image: bracelet },
          { label: 'Necklaces', href: websiteUrlConfig.Jewellery.Necklaces, image: necklace },
        ],
      },
      {
        title: 'Rings',
        links: [
          { label: 'Engagement Rings', href: websiteUrlConfig.Jewellery.Rings },
          { label: 'Wedding Bands', href: websiteUrlConfig.Jewellery.Rings },
          { label: 'Eternity Rings', href: websiteUrlConfig.Jewellery.Rings },
          { label: 'Dress Rings', href: websiteUrlConfig.Jewellery.Rings },
          { label: 'Signet Rings', href: websiteUrlConfig.Jewellery.Rings },
        ],
      },
      {
        title: 'Earrings',
        links: [
          { label: 'Studs', href: websiteUrlConfig.Jewellery.Earrings },
          { label: 'Hoops', href: websiteUrlConfig.Jewellery.Earrings },
          { label: 'Drop Earrings', href: websiteUrlConfig.Jewellery.Earrings },
          { label: 'Cluster Earrings', href: websiteUrlConfig.Jewellery.Earrings },
        ],
      },
      {
        title: 'Bracelets & Necklaces',
        links: [
          { label: 'Tennis Bracelets', href: websiteUrlConfig.Jewellery.Bracelets },
          { label: 'Bangles', href: websiteUrlConfig.Jewellery.Bracelets },
          { label: 'Pendants', href: websiteUrlConfig.Jewellery.Necklaces },
          { label: 'Chains', href: websiteUrlConfig.Jewellery.Necklaces },
        ],
      },
    ],
  },
  { label: 'Events & Blogs', href: websiteUrlConfig.Blogs },
  { label: 'Contact us', href: websiteUrlConfig.Contact },
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
  {
    value: '1,396+',
    label: 'Jewellery Designs Produced',
    icon: Diamond,
  },
  {
    value: '3,000+',
    label: 'Certified Stones Available',
    icon: Gem,
  },
  {
    value: '50 Years',
    label: 'Trade Expertise',
    icon: Award,
  },
  {
    value: '5,000+',
    label: 'Clients Worldwide',
    icon: Users,
  },
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
    { label: 'About Us', href: websiteUrlConfig.Home },
    { label: 'Why Henig', href: websiteUrlConfig.Home },
    { label: 'Careers', href: websiteUrlConfig.Home },
    { label: 'Press', href: websiteUrlConfig.Contact },
  ],
  customerCare: [
    { label: 'FAQs', href: '/faq' },
    { label: 'How to Order', href: websiteUrlConfig.Home },
    { label: 'Terms & Conditions', href: websiteUrlConfig.Home },
    { label: 'Privacy Policy', href: websiteUrlConfig.Home },
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
    title: 'Bespoke Design Service',
    description: 'Custom design and manufacturing tailored to your specifications.',
  },
  {
    icon: 'Shield',
    title: 'Responsible Sourcing',
    description: 'Certified diamonds sourced through trusted partners, ensuring compliance.',
  },
  {
    icon: 'MessageCircle',
    title: 'Expert Guidance',
    description: 'Chat with us online, speak with our team by phone, or book a private appointment.',
  },
  {
    icon: 'RotateCcw',
    title: 'Straightforward Returns',
    description: 'Return your item within 30 days with a simple and efficient process.',
  },
];

export const uspBanner = [
  { label: 'FREE Delivery', description: 'For all website customers' },
  { label: 'Same Day Dispatch', description: 'On orders placed before 2pm' },
  { label: 'Representatives', description: 'Covering the UK & Ireland' },
  { label: 'Customer Service', description: 'We pride ourselves on this' },
];
