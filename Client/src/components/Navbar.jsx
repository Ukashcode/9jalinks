import { Link, NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import VerifiedSeal from './VerifiedSeal.jsx';
import Button from './Button.jsx';

const navLinkClass = ({ isActive }) =>
  `font-body text-sm font-medium transition-colors ${
    isActive ? 'text-primary-900' : 'text-primary-500 hover:text-primary-900'
  }`;

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-20 border-b border-primary-100 bg-surface/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <VerifiedSeal className="h-7 w-7" />
          <span className="font-display text-lg font-bold text-primary-900">9jaLinks</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <NavLink to="/" className={navLinkClass} end>
            Home
          </NavLink>
          <NavLink to="/about" className={navLinkClass}>
            About
          </NavLink>
          <NavLink to="/contact" className={navLinkClass}>
            Contact
          </NavLink>
          {user && (
            <NavLink to="/profile" className={navLinkClass}>
              Profile
            </NavLink>
          )}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <Button variant="outline" onClick={handleLogout}>
              Log out
            </Button>
          ) : (
            <>
              <Link to="/login" className="font-body text-sm font-medium text-primary-700">
                Log in
              </Link>
              <Link to="/signup">
                <Button variant="primary">Sign up</Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;