import React from 'react';
import CatalogueImg from '@/assets/jewellery/catalogue/diamonds-category.jpg';
import BespokeImg from '@/assets/jewellery/catalogue/lab-grown-diamond.jpg';

const CatalogueBespokeSection = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">

      {/* Catalogue Card */}
      <div className="relative group overflow-hidden rounded-lg h-80 md:h-96">
        <img
          src={CatalogueImg}
          alt="Catalogue"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 group-hover:brightness-75"
        />

        {/* Center Hover Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-3xl font-semibold text-brown-500">
            Catalogue
          </span>

          <button className="border border-brown-500 px-6 py-2 bg-white text-black rounded-lg font-medium">
            Enquire
          </button>
        </div>
      </div>

      {/* Bespoke Card */}
      <div className="relative group overflow-hidden rounded-lg h-80 md:h-96">
        <img
          src={BespokeImg}
          alt="Bespoke"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 group-hover:brightness-75"
        />

        {/* Center Hover Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-3xl font-semibold text-white">
            Bespoke
          </span>

          <button className="border border-white px-6 py-2 bg-transparent text-white rounded-lg font-medium">
            Enquire
          </button>
        </div>
      </div>

    </section>
  );
};

export default CatalogueBespokeSection;
