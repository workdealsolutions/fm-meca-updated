import Navbar from '../../Navbar/Navbar';
import PartnersShowCase from '../PartnersShowcase'; 
import Footer from '../../Footer/Footer';

const PartnersPage = () => {
  return (
    <div className="partners-page" style={{ backgroundColor: '#000000' }}>
      <Navbar />
      <PartnersShowCase />
      <Footer />
    </div>
  );
};

export default PartnersPage;
