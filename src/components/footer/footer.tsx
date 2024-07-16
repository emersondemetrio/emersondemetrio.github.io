import { Links } from '@/constants';
import { Link } from 'react-router-dom';
import { iconOf } from '@/components/social-icons/social-icons';

export const Footer = () => {
  return (
    <footer className="bg-white">
      <div className="container mx-auto px-8">
        <div className="w-full flex flex-col md:flex-row py-6">
          <div className="flex-1 mb-6 text-black">
            <Link
              className="text-black-300 no-underline hover:no-underline font-bold text-2xl lg:text-2xl"
              to="/"
            >
              emerson.run ©️ {new Date().getFullYear()}
            </Link>
          </div>
          <div className="flex-1">
            <p className="uppercase text-gray-500 md:mb-6">Links</p>
            <ul className="list-reset mb-6">
              <li className="mt-2 inline-block mr-2 md:block md:mr-0">
                <Link
                  to="/"
                  className="btn  no-underline hover:underline text-white-800 hover:text-gray-500"
                >
                  Home
                </Link>
              </li>
              {['about', 'labs', 'blog'].map(footerLink => (
                <li
                  className="mt-2 inline-block mr-2 md:block md:mr-0"
                  key={footerLink}
                >
                  <Link
                    to={footerLink}
                    className="btn no-underline hover:underline text-white-800 hover:text-gray-500"
                  >
                    {footerLink.charAt(0).toUpperCase() + footerLink.slice(1)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1">
            <p className="uppercase text-gray-500 md:mb-6">Social</p>
            <ul className="list-reset mb-6">
              {Links.filter(s => s.category === 'social').map(social => (
                <li
                  className="mt-2 inline-block mr-2 md:block md:mr-0"
                  key={social.url}
                >
                  <Link
                    target="_blank"
                    to={social.url}
                    className="no-underline hover:underline text-gray-800 hover:text-gray-500"
                  >
                    {social.title} {iconOf(social.title)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};
