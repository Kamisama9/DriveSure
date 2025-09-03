// import { Link, useNavigate } from "react-router-dom";
// import { navLinks } from "../utils/utils";

// const Navbar = ({ user, onLogout }) => {
//   const navigate = useNavigate();

//   const handleLogoutClick = () => {
//     onLogout();
//     navigate("/login");
//   };

//   return (
//     <div className="border-b bg-black">
//       <div className="flex items-center justify-between px-6 py-4 container mx-auto">
//         <div className="flex items-center gap-4 text-white">
//           {navLinks.map((link, index) => (
//             <Link to={link.path} key={index}>
//               {link.name}
//             </Link>
//           ))}
//         </div>
//         <div>
//           {user ? (
//             <div className="flex items-center gap-4 text-white">
//               <span>Hi, {user.username}</span>
//               <button
//                 onClick={handleLogoutClick}
//                 className="cursor-pointer px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
//               >
//                 Logout
//               </button>
//             </div>
//           ) : (
//             <Link to="/login">
//               <button className="cursor-pointer px-8 py-2 bg-[#1f1f1f] hover:bg-blue-300 text-white rounded">
//                 Login
//               </button>
//             </Link>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Navbar;

import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { HiMiniBars3BottomRight } from 'react-icons/hi2';
import { CgClose } from 'react-icons/cg';
import { navLinks , MobileLinks} from '../utils/utils';





const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  function handleMobileLinks() {
    setIsOpen(!isOpen);
  }

  return (
    <>
      <nav className="bg-surface  p-2 md:pt-2 pt-5 w-full ">
        <div className=" cont  w-full ">
          <div className="flex  items-center justify-between h-16">
            <div className="flex-shrink-0">
              {/* <Link to="/">
                <img
                  className="max-w-[140px] theme-logo"
                  src={logo}
                  alt="Logo"
                />
              </Link> */}
            </div>

            {/* Desktop navbar */}
            <div className="hidden md:flex md:items-center md:justify-between">
              <div className="ml-10 flex items-baseline gap-7">
                {navLinks.map((link) => {
                  return (
                    <Link
                      key={link.id}
                      to={link.path}
                      className="primary-text "
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className="hidden md:flex md:items-center md:justify-between gap-4">
              <Link to="/login" className="primary-text">
                log In
              </Link>
              <Link to="/signup" className="primary-btn-nav">
                Sign Up
              </Link>
            </div>

            {/* Mobile navbar */}
            <div
              className="primary-text Heading md:hidden"
              onClick={handleMobileLinks}
            >
              {isOpen ? <CgClose /> : <HiMiniBars3BottomRight />}
            </div>
          </div>
          <div
            className={`${isOpen ? 'flex ' : 'hidden'}  md:hidden
               flex-col text-start gap-7 Normal
               bg-surface my-3 font-semibold p-5 `}
          >
            {MobileLinks.map((link) => {
              return (
                <Link
                  key={link.id}
                  to={link.path}
                  className="primary-text border-b-1"
                  onClick={handleMobileLinks}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;

