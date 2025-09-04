import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage"
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import RiderPage from "./pages/RiderPage";

const App = () => {
  return(
    <>
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/rider" element={<RiderPage/>}/>
      </Routes>
    </Router>
    </>
  )
}

export default App;