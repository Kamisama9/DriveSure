import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./components/Login";
import Signup from "./components/SIgnup";
import Footer from "./components/Footer";
import FeedbackPage from "./pages/Feedback";


function App() {
  const [user, setUser] = useState(null);
  console.log(user)
  const handleLogout = () => {
    setUser(null);
  };

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;
