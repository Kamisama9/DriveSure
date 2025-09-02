import { useState } from "react";
import axios from "axios";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Rider");

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const handleSignup = async () => {
    if (!validateEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!validatePassword(password)) {
      alert("Password must be at least 8 characters long.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3001/signup", {
        username,
        password,
        email,
        role,
      });
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl mb-4 text-white">Signup</h2>
      <input
        type="text"
        placeholder="Username"
        className="border p-2 w-full mb-2 text-white"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="border p-2 w-full mb-2 text-white"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        className="border p-2 w-full mb-2 text-white"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <select
        className="border p-2 w-full mb-4 text-white bg-gray-800"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="Rider">Rider</option>
        <option value="Owner">Owner</option>
        <option value="Admin">Admin</option>
      </select>
      <button onClick={handleSignup} className="bg-green-500 text-white px-4 py-2 rounded">
        Signup
      </button>
    </div>
  );
};

export default Signup;
