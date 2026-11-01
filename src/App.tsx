import { useEffect } from "react";
import { Footer } from "./components/Footer";
import { Gallery } from "./components/Gallery";
import { Gastronomy } from "./components/Gastronomy";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Location } from "./components/Location";
import { Reviews } from "./components/Reviews";
import { Story } from "./components/Story";

export default function App() {
  // O site é montado depois que o navegador tenta ir à âncora do endereço, então um link direto é resolvido aqui.
  // As fontes da web mudam a altura das seções acima do destino, por isso o ajuste é refeito quando elas chegam.
  useEffect(() => {
    const target = document.getElementById(window.location.hash.slice(1));
    if (!target) return;

    const alignTarget = () => target.scrollIntoView({ behavior: "instant" });
    alignTarget();
    void document.fonts.ready.then(alignTarget);
  }, []);

  return (
    <>
      <Header />
      <main id="conteudo" tabIndex={-1} className="outline-none">
        <Hero />
        <Story />
        <Gastronomy />
        <Gallery />
        <Reviews />
        <Location />
      </main>
      <Footer />
    </>
  );
}
