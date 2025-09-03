import { useState } from "react";
import HeroBg from "../assets/hero/hero-bg.png";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      <div className="flex flex-col md:flex-row w-full h-screen overflow-hidden">
        <div className="flex items-center justify-center w-full md:w-1/2 bg-black bg-opacity-70 p-10">
          <div className="text-white w-full max-w-md">
            <h1 className="font-bold text-4xl mb-6 text-center">Login</h1>
            <form className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Enter email"
                className="w-full p-2 border rounded-md bg-transparent text-white placeholder-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Enter password"
                className="w-full p-2 border rounded-md bg-transparent text-white placeholder-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md"
              >
                Login
              </button>
            </form>
            <div className="text-center mt-4">
              Don't have an account?{" "}
              <Link to='/signup'>
              <span className="cursor-pointer text-blue-400">Register</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="hidden md:block md:w-1/2 h-full">
          <img
            src={HeroBg}
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </>
  );
}

export default Login;