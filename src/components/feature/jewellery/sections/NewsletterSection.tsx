import React, { useState } from 'react';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your newsletter submission logic here
    console.log('Email submitted:', email);
    setEmail('');
  };

  return (
    <section className="bg-gray-100 py-12 flex justify-center items-center">
      <div className="max-w-4xl w-full flex flex-col md:flex-row items-center justify-between gap-6 px-4">
        <div className="flex justify-center md:justify-start w-full md:w-auto">
          {/* Replace with your image */}
          <img
            src="/images/newsletter-left.png"
            alt="Gold Bracelet"
            className="h-16 md:h-24 object-contain"
          />
        </div>

        <div className="text-center md:text-left flex-1">
          <h2 className="text-lg md:text-xl font-medium mb-4">
            Sign Up To Our Newsletter For 15% Off Your First Order.
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 justify-center md:justify-start">
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="px-4 py-2 border border-gray-300 rounded-md w-full sm:w-auto"
            />
            <button
              type="submit"
              className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition"
            >
              Sign Up
            </button>
          </form>
        </div>

        <div className="flex justify-center md:justify-end w-full md:w-auto">
          {/* Replace with your image */}
          <img
            src="/images/newsletter-right.png"
            alt="Gold Earrings"
            className="h-16 md:h-24 object-contain"
          />
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
