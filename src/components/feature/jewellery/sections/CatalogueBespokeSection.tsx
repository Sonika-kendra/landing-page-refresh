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
          className="w-full h-full object-cover rounded-lg transition-transform duration-500 ease-in-out group-hover:scale-105 group-hover:brightness-110"
        />
        <h2 className="absolute top-4 left-4 text-3xl font-semibold text-brown-500">
          Catalogue
        </h2>
        <button className="absolute bottom-4 left-4 border border-brown-500 px-5 py-2 text-black bg-white rounded-lg font-medium">
          Enquire
        </button>
      </div>

      {/* Bespoke Card */}
      <div className="relative group overflow-hidden rounded-lg h-80 md:h-96">
        <img
          src={BespokeImg}
          alt="Bespoke"
          className="w-full h-full object-cover rounded-lg transition-transform duration-500 ease-in-out group-hover:scale-105 group-hover:brightness-110"
        />
        <h2 className="absolute top-4 left-4 text-3xl font-semibold text-white">
          Bespoke
        </h2>
        <button className="absolute bottom-4 left-4 border border-white px-5 py-2 text-white bg-transparent rounded-lg font-medium">
          Enquire
        </button>
      </div>
    </section>
  );
};

export default CatalogueBespokeSection;
