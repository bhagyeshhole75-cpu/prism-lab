import Hero from "./components/Hero.jsx";
import Lab from "./components/Lab.jsx";
import { CloudStatus, FloatingBar, Footer, Nav, Stack } from "./components/Sections.jsx";
import usePresets from "./hooks/usePresets.js";

export default function App() {
  const { presets, source } = usePresets();

  return (
    <>
      <Nav />
      <main>
        <Hero preset={presets[0]} />
        <Lab presets={presets} source={source} />
        <Stack />
        <CloudStatus />
      </main>
      <Footer />
      <FloatingBar />
    </>
  );
}
