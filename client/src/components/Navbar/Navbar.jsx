import { Link } from "react-router-dom";
import logo from "/logo-zoom.png";

const Navbar = () => {
  return (
    <header className="w-full bg-[#0f0f0f] text-white">
      <nav className="flex items-center justify-between h-16 px-4">
        <a href="/" className="flex items-center">
          <img
            src={logo}            
            alt="Nomad"
            className="m-3 h-15 w-20 rounded-full object-cover border border-white/30"
          />
          <span className="sr-only">Home</span>
        </a>

        
        <div className="flex items-center gap-3">
          <button
            className="
              cursor-pointer px-6 py-2
              bg-black text-white rounded
              shadow-sm transition-all duration-200 ease-out transform-gpu
              hover:-translate-y-0.5 hover:shadow-md
              focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50
              hover:ring-2 hover:ring-red-600
            "
          >
            Book a Nomad Cab
          </button>

          <Link to="/login">
          <button
            className="
            cursor-pointer px-8 py-2
            bg-[#1f1f1f] hover:bg-red-600
            text-white rounded
            transition-colors
            "
          >
            Login
          </button>
          </Link>


          <Link to="/signup">
          <button
            className="
              cursor-pointer px-8 py-2
              bg-[#1f1f1f] hover:bg-red-600
              text-white rounded
              transition-colors
            "
          >
            Sign Up
          </button>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;