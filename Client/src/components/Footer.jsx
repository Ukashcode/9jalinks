import { Link } from 'react-router-dom';
import VerifiedSeal from './VerifiedSeal.jsx';

const Footer = () => {
  return (
    <footer className="border-t border-primary-100 bg-primary-900 text-primary-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 md:flex-row md:items-start md:justify-between">
      

        

        <p className="text-sm text-primary-300">
          © {new Date().getFullYear()} 9jaLinks. Built for a safer Nigerian marketplace.
        </p>
      </div>
    </footer>
  );
};

export default Footer;