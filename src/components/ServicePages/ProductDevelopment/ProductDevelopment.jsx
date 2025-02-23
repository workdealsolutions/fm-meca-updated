import React from 'react';
import Navbar from '../../Navbar/Navbar';
import Footer from '../../Footer/Footer';
import ComingSoon from '../ComingSoon';
import './ProductDevelopment.css';

const ProductDevelopment = () => {
  return (
    <div className="service-page">
      <Navbar />
      <main className="service-content">
        <ComingSoon />
      </main>
      <Footer />
    </div>
  );
};

export default ProductDevelopment;
