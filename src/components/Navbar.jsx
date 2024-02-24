import React from "react";
import { Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { IoMdMail } from "react-icons/io";
const Navbar = () => {
  const { logout, isLoggedIn } = useUser();

  return (
    <header className="text-gray-600 body-font">
      <div className="container flex flex-col flex-wrap items-center p-5 mx-auto md:flex-row">
        <Link
          to="/"
          className="flex items-center mb-4 font-medium text-gray-900 title-font md:mb-0"
        >
          <IoMdMail size={32} />
          <span className="ml-3 text-xl">NewsLetter</span>
        </Link>
        <nav className="flex flex-wrap items-center justify-center text-base md:mr-auto md:ml-4 md:py-1 md:pl-4 md:border-l md:border-gray-400">
          <Link to="/" className="mr-5 hover:text-gray-900">
            Publications
          </Link>
          <Link to="/create" className="mr-5 hover:text-gray-900">
            Become a Author
          </Link>
          {isLoggedIn && (
            <>
              <Link
                to="/create-newsletter"
                className="mr-5 hover:text-gray-900"
              >
                NewsLetter
              </Link>
              <Link to="/mypublications" className="mr-5 hover:text-gray-900">
                My Publications
              </Link>
            </>
          )}
        </nav>
        {isLoggedIn ? (
          <button
            onClick={() => logout()}
            className="inline-flex items-center px-3 py-1 mt-4 text-base bg-gray-100 border-0 rounded focus:outline-none hover:bg-gray-200 md:mt-0"
          >
            Logout
            <svg
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="w-4 h-4 ml-1"
              viewBox="0 0 24 24"
            >
              <path d="M5 12h14M12 5l7 7-7 7"></path>
            </svg>
          </button>
        ) : (
          <Link to="/Login">
            <button className="inline-flex items-center px-3 py-1 mt-4 text-base bg-gray-100 border-0 rounded focus:outline-none hover:bg-gray-200 md:mt-0">
              Login
              <svg
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="w-4 h-4 ml-1"
                viewBox="0 0 24 24"
              >
                <path d="M5 12h14M12 5l7 7-7 7"></path>
              </svg>
            </button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Navbar;
