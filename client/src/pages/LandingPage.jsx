import FAQ from "../components/Faqs/Faqs";
import HeroSection from "../components/Hero/HeroSection";
import PlanSection from "../components/Plan/PlanSection";
import Testimonials from "../components/Testimonials/Testimonials";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

const LandingPage = () => {
  return (
    <>
    <Navbar/>
    <HeroSection/>
    <PlanSection/>
    <Testimonials/>
    <FAQ/>
    <Footer/>
    </>
  );
}

export default LandingPage;
