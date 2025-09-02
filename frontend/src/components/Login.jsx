import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Login = ({ setUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:3001/login", { username, password });
      alert(res.data.message);
      setUser(res.data.user); 
      navigate("/"); 
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl mb-4 text-white">Login</h2>
      <input
        type="text"
        placeholder="Username"
        className="border p-2 w-full mb-2 text-white bg-black"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="border p-2 w-full mb-4 text-white bg-black"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
        Login
      </button>
      <p className="text-sm text-white">
        New User?{" "}
        <Link to="/signup">
          <button className="bg-green-500 text-white px-4 py-2 rounded ml-2">Sign Up</button>
        </Link>
      </p>
    </div>
  );
};

export default Login;
