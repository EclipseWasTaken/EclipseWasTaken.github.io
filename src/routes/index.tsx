import { createFileRoute } from "@tanstack/react-router";
import { Loader } from "@/components/eclipse/Loader";
import { CustomCursor } from "@/components/eclipse/CustomCursor";
import { SmoothScroll } from "@/components/eclipse/SmoothScroll";
import { DotNav } from "@/components/eclipse/DotNav";
import { Hero } from "@/components/eclipse/sections/Hero";
import { Gallery } from "@/components/eclipse/sections/Gallery";
import { About } from "@/components/eclipse/sections/About";
import { Experience } from "@/components/eclipse/sections/Experience";
import { Leadership } from "@/components/eclipse/sections/Leadership";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <main className="relative min-h-screen text-foreground">
      <SmoothScroll />
      <CustomCursor />
      <Loader />
      <DotNav />
      <Hero />
      <Gallery />
      <About />
      <Experience />
      <Leadership />
    </main>
  );
}
