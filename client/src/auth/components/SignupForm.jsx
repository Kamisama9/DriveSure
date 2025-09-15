import { useState } from 'react';

const SignupForm = ({ onSignup, error }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSignup(formData);
  };

  return (
    <form className="flex gap-3 flex-col mt-5 min-w-100" onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        placeholder="Enter name"
        className="w-full p-2 border text-white rounded-md mb-2 bg-transparent"
        value={formData.name}
        onChange={handleChange}
      />
      <input
        type="email"
        name="email"
        placeholder="Enter email"
        className="w-full p-2 border text-white rounded-md mb-2 bg-transparent"
        value={formData.email}
        onChange={handleChange}
      />
      <input
        type="password"
        name="password"
        placeholder="Enter password"
        className="w-full p-2 border text-white rounded-md bg-transparent"
        value={formData.password}
        onChange={handleChange}
      />
      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirm password"
        className="w-full p-2 border text-white rounded-md bg-transparent"
        value={formData.confirmPassword}
        onChange={handleChange}
      />
      <select
        name="role"
        value={formData.role}
        onChange={handleChange}
        className="w-full p-2 border rounded-md bg-[#151212]"
      >
        <option value="" disabled>
          -- Select Role --
        </option>
        <option value="rider">Rider</option>
        <option value="driver">Driver</option>
      </select>
      {error && (
        <div className="text-red-500 text-sm bg-red-100/10 p-2 rounded">
          {error}
        </div>
      )}
      <button
        type="submit"
        className="primary-btn-nav mt-5 flex justify-center items-center w-50"
        disabled={!formData.name || !formData.email || !formData.password || !formData.confirmPassword || !formData.role}
      >
        Sign Up
      </button>
    </form>
  );
};

export default SignupForm;
