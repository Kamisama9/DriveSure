import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import RiderPage from "./pages/RiderPage";
import DriverPage from "./pages/DriverPage";
import AdminPage from "./pages/AdminPage";
import BookingPage from "./pages/BookingPage";

const App = () => {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<LandingPage />} />
				<Route path="/auth" element={<Login />} />
				<Route path="/rider" element={<RiderPage />} />
        		<Route path="/driver" element={<DriverPage/>}/>
       		 	<Route path="/admin" element={<AdminPage/>}/>
				<Route path="/booking" element = {<BookingPage/>}/>
			</Routes>
		</Router>
	);
};


export default App;
