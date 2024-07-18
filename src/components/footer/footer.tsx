import { linkGet } from '@/constants';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-black px-3 py-12 text-center text-white border-t">
      <Link
        target="_blank"
        to={linkGet('instagram').url}
        className="btn btn-black"
      >
        Emerson Demetrio
      </Link>
      <p>&copy; {new Date().getFullYear()}</p>
    </footer>
  );
};
