import { useState } from "react";
import HeroBg from "../assets/hero/hero-bg.png";
import useStore from "../store/store.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [role, setRole] = useState("");
	const { mode, setMode } = useStore();
	const navigate = useNavigate();

	const login = async (e) => {
		e.preventDefault();
		if (!email || !password) {
			alert("Please enter both email and password.");
			return;
		}

		try {
			const res = await axios.post("http://localhost:3000/login", {
				email,
				password,
			});

			if (res.data?.user) {
				console.log("Login successful:", res.data);
				navigate("/rider");
			} else {
				alert("Login failed. Please check your credentials.");
			}
		} catch (err) {
			console.error("Login error:", err);
			alert("An error occurred during login.");
		}
	};

	const signup = async (e) => {
		e.preventDefault();
		if (!name || !email || !password || !confirmPassword || !role) {
			alert("All fields are required.");
			return;
		}

		if (password !== confirmPassword) {
			alert("Passwords do not match.");
			return;
		}

		try {
			const res = await axios.post("http://localhost:3000/signup", {
				name,
				email,
				password,
				role,
			});

			if (res.data?.userId) {
				console.log("Signup successful:", res.data);
				navigate("/rider");
			} else {
				alert("Signup failed.");
			}
		} catch (err) {
			console.error("Signup error:", err);
			alert("An error occurred during signup.");
		}
	};

	return (
		<div
			id="Hero"
			className="flex md:flex-row flex-col text-center
        md:text-start cont  items-center w-full h-[100vh] relative overflow-hidden"
		>
			<div
				className={`flex flex-col gap-2 ml-30 absolute transform
        ${mode === "login" ? "translate-x-0" : "-translate-x-[100vw]"}
        transition-transform duration-500 ease-in-out`}
			>
				<h1 className="font-bold text-[3rem] md:text-[3.5rem] leading-15">
					Login
				</h1>
				<form className="flex gap-3 flex-col mt-5 min-w-100">
					<input
						type="email"
						placeholder="Enter email"
						className="w-full p-2 border text-white rounded-md mb-2 bg-transparent"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<input
						type="password"
						placeholder="Enter password"
						className="w-full p-2 border text-white rounded-md bg-transparent"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>

					<button
						onClick={login}
						className="primary-btn-nav mt-5 flex justify-center items-center w-50"
					>
						Login
					</button>
				</form>
				<p className="text-white mt-4">
					Don't have an account?
					<p
						onClick={() => setMode("signup")}
						className="primary-text ml-1 underline cursor-pointer inline"
					>
						Register
					</p>
				</p>
			</div>

			<div
				className={`flex flex-col gap-2 ml-69 absolute transform
        ${mode === "signup" ? "translate-x-full" : "translate-x-[100vw]"}
        transition-transform duration-500 ease-in-out`}
			>
				<h1 className="font-bold text-[3rem] md:text-[3.5rem] leading-15">
					Sign Up
				</h1>
				<form className="flex gap-3 flex-col mt-5 min-w-100">
					<input
						type="text"
						placeholder="Enter name"
						className="w-full p-2 border text-white rounded-md mb-2 bg-transparent"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
					<input
						type="email"
						placeholder="Enter email"
						className="w-full p-2 border text-white rounded-md mb-2 bg-transparent"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<input
						type="password"
						placeholder="Enter password"
						className="w-full p-2 border text-white rounded-md bg-transparent"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<input
						type="password"
						placeholder="Enter confirm password"
						className="w-full p-2 border text-white rounded-md bg-transparent"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
					/>
					<select
						value={role}
						onChange={(e) => setRole(e.target.value)}
						className="w-full p-2 border rounded-md bg-[#151212]"
					>
						<option value="" selected>
							-- Select Role --
						</option>
						<option value="rider">Rider</option>
						<option value="driver">Driver</option>
					</select>

					<button
						onClick={signup}
						className="primary-btn-nav mt-5 flex justify-center items-center w-50"
					>
						Sign Up
					</button>
				</form>
				<p className="text-white mt-4">
					Already have an account?
					<p
						onClick={() => setMode("login")}
						className="primary-text ml-1 underline cursor-pointer inline"
					>
						Login
					</p>
				</p>
			</div>

			<div className="hidden md:flex">
				<img
					src={HeroBg}
					className={`absolute top-0 right-0 z-[-1] opacity-70
    transform transition-all duration-1000 ease-in-out
    ${
			mode === "signup"
				? "scale-x-[-1] -translate-x-full"
				: "scale-x-100 translate-x-0"
		}`}
				/>
			</div>
		</div>
	);
}

export default Login;
