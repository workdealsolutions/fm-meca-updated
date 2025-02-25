<<<<<<< HEAD
=======

>>>>>>> cf6d65c27f3ff2eb03eaa3207fec06cd90ed5f1b
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
