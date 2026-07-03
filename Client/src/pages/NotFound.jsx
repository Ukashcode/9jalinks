import { Link } from 'react-router-dom';
import Button from '../components/Button.jsx';

const NotFound = () => {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-5xl font-extrabold text-primary-900">404</h1>
      <p className="mt-3 font-body text-primary-500">
        This page doesn't exist — maybe it moved, or the link was wrong.
      </p>
      <Link to="/" className="mt-6">
        <Button variant="primary">Back to home</Button>
      </Link>
    </div>
  );
};

export default NotFound;