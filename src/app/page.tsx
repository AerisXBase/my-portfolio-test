"use client";

import Hero from "@/components/Hero";
import About from "@/components/About";
import ProjectsPreview from "@/components/ProjectsPreview";

export default function HomePage() {
  // const [showIntro, setShowIntro] = useState(true);

  // useEffect(() => {
  //   const t = setTimeout(() => setShowIntro(false), 10000);
  //   return () => clearTimeout(t);
  // }, []);

  // if (showIntro) {
  //   return null;
  // }

  return (
    <>
      <Hero />
      <About />
      <ProjectsPreview />
    </>
  );
}
