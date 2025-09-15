import { Link } from "react-router-dom";
import logo from "/logo-dark.png";
import useStore from "../../store/store";

const Navbar = () => {
	const user = useStore((s) => s.user);

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
					{user ? (
						<>
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
							<span className="primary-text">{user.email}</span>
							<button 
								onClick={() => {
									localStorage.removeItem('token');
									window.location.reload();
								}} 
								className="primary-btn-nav"
							>
								Logout
							</button>
						</>
					) : (
						<>
							<Link to="/auth" className="primary-text">
								Log In
							</Link>
							<Link to="/auth" className="primary-btn-nav">
								Sign Up
							</Link>
						</>
					)}
				</div>
			</nav>
		</header>
	);
};

export default Navbar;
