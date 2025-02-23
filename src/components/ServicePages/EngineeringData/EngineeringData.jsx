import React from 'react';
import Navbar from '../../Navbar/Navbar';
import Footer from '../../Footer/Footer';
import './EngineeringData.css';
import ComingSoon from '../ComingSoon';

const EngineeringData = () => {
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

export default EngineeringData;
