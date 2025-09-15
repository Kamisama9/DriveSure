import { useState } from 'react';

const LoginForm = ({ onLogin, error }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <form className="flex gap-3 flex-col mt-5 min-w-100" onSubmit={handleSubmit}>
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
      {error && (
        <div className="text-red-500 text-sm bg-red-100/10 p-2 rounded">
          {error}
        </div>
      )}
      <button
        type="submit"
        className="primary-btn-nav mt-5 flex justify-center items-center w-50"
      >
        Login
      </button>
    </form>
  );
};

export default LoginForm;
