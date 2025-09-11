import FAQ from "../components/Faqs/Faqs";
import HeroSection from "../components/Hero/HeroSection";
import PlanSection from "../components/Plan/PlanSection";
import Testimonials from "../components/Testimonials/Testimonials";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import ScrollAnimation from "../components/ScrollAnimation";

const LandingPage = () => {
  return (
    <>
    <Navbar />
    <HeroSection />
    <ScrollAnimation>
      <PlanSection />
    </ScrollAnimation>
    <ScrollAnimation>
      <Testimonials />
    </ScrollAnimation>
    <ScrollAnimation>
      <FAQ />
    </ScrollAnimation>
    <ScrollAnimation>
      <Footer />
    </ScrollAnimation>
    </>
  );
}

export default LandingPage;
