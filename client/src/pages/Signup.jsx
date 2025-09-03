import { useState } from "react";
import HeroBg from "../assets/hero/hero-bg.png";
import { Link } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    password: "",
    city: "",
    state: "",
    role: "rider", // default role
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <div className="flex flex-col md:flex-row w-full h-screen overflow-hidden">
        <div className="flex items-center justify-center w-full md:w-1/2 bg-black bg-opacity-70 p-10">
          <div className="text-white w-full max-w-md">
            <h1 className="font-bold text-4xl mb-6 text-center">Signup</h1>
            <form className="flex flex-col gap-4">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                className="p-2 border rounded-md bg-transparent text-white placeholder-white"
                value={formData.firstName}
                onChange={handleChange}
              />
              <input
                type="text"
                name="middleName"
                placeholder="Middle Name"
                className="p-2 border rounded-md bg-transparent text-white placeholder-white"
                value={formData.middleName}
                onChange={handleChange}
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                className="p-2 border rounded-md bg-transparent text-white placeholder-white"
                value={formData.lastName}
                onChange={handleChange}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="p-2 border rounded-md bg-transparent text-white placeholder-white"
                value={formData.email}
                onChange={handleChange}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="p-2 border rounded-md bg-transparent text-white placeholder-white"
                value={formData.password}
                onChange={handleChange}
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                className="p-2 border rounded-md bg-transparent text-white placeholder-white"
                value={formData.city}
                onChange={handleChange}
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                className="p-2 border rounded-md bg-transparent text-white placeholder-white"
                value={formData.state}
                onChange={handleChange}
              />

              <div className="flex gap-4 text-white">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="role"
                    value="rider"
                    checked={formData.role === "rider"}
                    onChange={handleChange}
                  />
                  Rider
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="role"
                    value="driver"
                    checked={formData.role === "driver"}
                    onChange={handleChange}
                  />
                  Driver
                </label>
              </div>

              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white py-2 rounded-md"
              >
                Signup
              </button>
            </form>
            <div className="text-center mt-4">
              Already have an account?{" "}
              <Link to='/login'>
              <span className="cursor-pointer text-blue-400">Login</span>
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

export default Signup;