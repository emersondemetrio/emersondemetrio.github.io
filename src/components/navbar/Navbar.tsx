import { useIsMobile } from "@/hooks/use-is-mobile/use-is-mobile";
import { useState } from "react";
import { Link } from "react-router-dom";

const appRoutes = [
  {
    label: "Home",
    link: "/",
  },
  {
    label: "Labs 🧪",
    link: "/labs",
  },
  {
    label: "About",
    link: "/about",
  },
  {
    label: "Blog",
    link: "/blog",
  },
];

export const Navbar = () => {
  const currentScreen = window.screen.width;
  const isMobile = useIsMobile();
  const [navbarOpen, setNavbarOpen] = useState(
    !isMobile && currentScreen > 1024,
  );

  return (
    <nav id="header" className="sticky w-full z-30 top-0 text-white bg-black">
      <div className="w-full container mx-auto flex flex-wrap items-center justify-between mt-0 py-2">
        <div className="pl-4 flex items-center">
          <Link
            className="text-white no-underline hover:no-underline font-bold text-1xl lg:text-2xl"
            to="/"
          >
            emerson.run
          </Link>
        </div>
        <div className="block lg:hidden pr-4">
          <button
            type="button"
            id="nav-toggle"
            onClick={() => setNavbarOpen(!navbarOpen)}
            className="flex items-center p-1 text-gray-800 hover:text-gray-900 focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
          >
            <svg
              className="fill-current h-6 w-6"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              style={{ background: "#fff" }}
            >
              <title>Menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>
          </button>
        </div>
        <div
          style={{
            height: !isMobile ? 80 : "auto",
          }}
          className={"w-full flex-grow lg:flex lg:items-center lg:w-auto lg:block mt-2 lg:mt-0 lg:bg-transparent text-black p-4 lg:p-0 z-20" +
            (navbarOpen ? " block" : " hidden")}
          id="nav-content"
        >
          <ul className="list-reset lg:flex justify-end flex-1 items-center">
            {appRoutes.map((menu, index) => (
              <li className="mr-3" key={index}>
                <Link
                  to={menu.link}
                  className="inline-block text-white no-underline hover:text-white-800 hover:text-underline py-2 px-4"
                >
                  {menu.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <hr className="border-b border-gray-100 opacity-25 my-0 py-0" />
    </nav>
  );
};
