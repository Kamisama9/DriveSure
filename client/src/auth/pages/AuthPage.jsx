import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useStore from "../../store/store";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";
import HeroBg from "../../assets/hero/hero-bg.png";

const AuthPage = () => {
  const [mode, setMode] = useState("login");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const setUser = useStore((s) => s.setUser);

  const handleLogin = async (email, password) => {
    setError("");
    
    try {
      const res = await axios.post("http://localhost:3000/auth/login", { 
        email, 
        password 
      });
      
      const { user, token } = res.data;
      
      // Save token
      localStorage.setItem('token', token);
      
      // Save user info
      setUser(user);
      
      // Navigate based on role
      navigate(`/${user.role}`);
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  const handleSignup = async (formData) => {
    setError("");

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword || !formData.role) {
      setError("All fields are required.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      const res = await axios.post("/auth/signup", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        city: "",
        state: "",
        role: formData.role,
        role_description: formData.role === 'driver' ? 'Pending approval' : '',
      });

      if (res.data.message === "Signup successful") {
        alert("Signup successful! Please log in.");
        setMode("login");
      }
    } catch (err) {
      console.error("Signup error:", err);
      if (err.response?.status === 409) {
        setError("Email is already registered. Please use a different email.");
      } else if (err.response?.data?.errors?.length > 0) {
        setError(err.response.data.errors[0]);
      } else {
        setError("An error occurred during signup. Please try again.");
      }
    }
  };

  return (
    <div
      id="Hero"
      className="flex md:flex-row flex-col text-center md:text-start cont items-center w-full h-[100vh] relative overflow-hidden"
    >
      {/* Login Form */}
      <div
        className={`absolute transform ${
          mode === "login" ? "translate-x-0" : "-translate-x-[100vw]"
        } transition-transform duration-500 ease-in-out flex flex-col gap-2 ml-30`}
      >
        <h1 className="font-bold text-[3rem] md:text-[3.5rem] leading-15">
          Login
        </h1>
        <LoginForm onLogin={handleLogin} error={error} />
        <p className="text-white mt-4">
          Don't have an account?
          <span
            onClick={() => setMode("signup")}
            className="primary-text ml-1 underline cursor-pointer"
          >
            {" "}
            Register
          </span>
        </p>
      </div>

      {/* Signup Form */}
      <div
        className={`absolute transform ${
          mode === "signup" ? "translate-x-full" : "translate-x-[100vw]"
        } transition-transform duration-500 ease-in-out flex flex-col gap-2 ml-69`}
      >
        <h1 className="font-bold text-[3rem] md:text-[3.5rem] leading-15">
          Sign Up
        </h1>
        <SignupForm onSignup={handleSignup} error={error} />
        <p className="text-white mt-4">
          Already have an account?
          <span
            onClick={() => setMode("login")}
            className="primary-text ml-1 underline cursor-pointer"
          >
            {" "}
            Login
          </span>
        </p>
      </div>

      <div className="hidden md:flex">
        <img
          src={HeroBg}
          className={`absolute top-0 right-0 z-[-1] opacity-70 transform transition-all duration-1000 ease-in-out ${
            mode === "signup"
              ? "scale-x-[-1] -translate-x-full"
              : "scale-x-100 translate-x-0"
          }`}
          alt="Background"
        />
      </div>
    </div>
  );
};

export default AuthPage;
