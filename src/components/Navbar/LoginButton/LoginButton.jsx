import { motion } from 'framer-motion';
import { FiUser } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import './LoginButton.css';

const LoginButton = () => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="login-button-wrapper"
    >
      <Link to="/login" className="login-button">
        <button className="slide-button">
          Login
        </button>
      </Link>
    </motion.div>
  );
};

export default LoginButton;



