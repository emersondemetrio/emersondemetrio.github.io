import { useState } from "react";
import { Link } from "react-router-dom";

const appRoutes = [
  {
    label: "Home",
    link: "/",
  },
  {
    label: "Experiments",
    link: "/experiments",
  },
  {
    label: "About",
    link: "/about",
  },
  {
    label: "Blog",
    link: "/blog",
  },
]

export const Navbar = () => {
  const [isOpen, setOpen] = useState(false);

  return (
    <div className="w-full">
      <nav className="container relative flex flex-wrap items-center justify-between p-8 mx-auto lg:justify-between xl:px-0">
        <div>
          <div className="flex flex-wrap items-center justify-between w-full lg:w-auto">
            <Link to="/">
              <span className="flex items-center space-x-2 text-2xl font-medium text-indigo-500 dark:text-gray-100">
                <span>
                  @emersondemetrio
                </span>
              </span>
            </Link>
          </div>
        </div>

        <div
          aria-label="Toggle Menu"
          onClick={() => setOpen(!isOpen)}
          className="px-2 py-1 ml-auto text-gray-500 rounded-md lg:hidden hover:text-indigo-500 focus:text-indigo-500 focus:bg-indigo-100 focus:outline-none dark:text-gray-300 dark:focus:bg-trueGray-700">
          <svg
            className="w-6 h-6 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24">
            {isOpen && (
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
              />
            )}
            {!isOpen && (
              <path
                fillRule="evenodd"
                d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
              />
            )}
          </svg>
        </div>

        {isOpen && <div className="flex flex-wrap w-full my-5 lg:hidden">
          <>
            {appRoutes.map((menu, index) => (
              <Link key={index} to="/" className="w-full px-4 py-2 -ml-4 text-gray-500 rounded-md dark:text-gray-300 hover:text-indigo-500 focus:text-indigo-500 focus:bg-indigo-100 dark:focus:bg-gray-800 focus:outline-none">
                {menu.label}
              </Link>
            ))}
          </>
        </div>}

        <div className="hidden text-center lg:flex lg:items-center">
          <ul className="items-center justify-end flex-1 pt-6 list-none lg:pt-0 lg:flex">
            {appRoutes.map((menu, index) => (
              <li className="mr-3 nav__item" key={index}>
                <Link to={menu.link} className="inline-block px-4 py-2 text-lg font-normal text-gray-800 no-underline rounded-md dark:text-gray-200 hover:text-indigo-500 focus:text-indigo-500 focus:bg-indigo-100 focus:outline-none dark:focus:bg-gray-800">
                  {menu.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="hidden mr-3 space-x-4 lg:flex nav__item">
          <Link to="/" className="px-6 py-2 text-white bg-indigo-600 rounded-md md:ml-5">
            /home
          </Link>
        </div>
      </nav>
    </div>
  );
}

