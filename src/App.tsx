import { Experience } from "./components/Experience";
import { Footer } from "./components/Footer";
import { Gallery } from "./components/Gallery";
import { Gastronomy } from "./components/Gastronomy";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Location } from "./components/Location";
import { Reviews } from "./components/Reviews";
import { Story } from "./components/Story";

export default function App() {
  return (
    <>
      <Header />
      <main id="conteudo" tabIndex={-1} className="outline-none">
        <Hero />
        <Story />
        <Gastronomy />
        <Experience />
        <Gallery />
        <Reviews />
        <Location />
      </main>
      <Footer />
    </>
  );
}
