import { Link, useNavigate } from "react-router-dom";
import logo from "/logo-dark.png";
import useStore from "../../store/store";

const Navbar = () => {
	const { setMode } = useStore();
	const navigate = useNavigate();

	const go = (m) => {
		setMode(m);
		navigate("/auth");
	};

	return (
		<header className="w-full bg-[#0f0f0f] text-white fixed top-0 z-50 shadow-md">
			<nav className="flex items-center justify-between h-16 px-4">
				<a href="/" className="flex items-center">
					<img
						src={logo}
						alt="Nomad"
						className="m-3 h-15 w-20 object-contain brightness-125 contrast-125 saturate-150 mix-blend-lighten"
					/>
					<span className="sr-only">Home</span>
				</a>

				<div className="flex items-center gap-3">
					<Link to="/booking">
						<button
							className="
            	cursor-pointer px-6 py-2
              bg-[#0f0f0f] text-white rounded
              shadow-sm transition-all duration-200 ease-out transform-gpu
              hover:-translate-y-0.5 hover:shadow-md
              focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50
              hover:ring-2 hover:ring-red-600
            "
						>
							Book a Nomad Cab
						</button>
					</Link>

					<p
						onClick={() => go("login")}
						className="primary-text cursor-pointer"
					>
						log In
					</p>
					<button onClick={() => go("signup")} className="primary-btn-nav">
						Sign Up
					</button>
				</div>
			</nav>
		</header>
	);
};

export default Navbar;
