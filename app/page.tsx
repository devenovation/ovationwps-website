import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import TrustBar from "./components/TrustBar";
import Stats from "./components/Stats";
import About from "./components/About";
import Leadership from "./components/Leadership";
import Services from "./components/Services";
import Depot from "./components/Depot";
import Certifications from "./components/Certifications";
import Locations from "./components/Locations";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TrustBar />
        <Stats />
        <About />
        <Services />
        <Depot />
        <Leadership />
        <Certifications />
        <Contact />
        <Locations />
      </main>
      <Footer />
    </>
  );
}
