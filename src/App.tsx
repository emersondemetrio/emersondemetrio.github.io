import "react";
import "./index.css";
import { Route, Routes, Navigate, HashRouter } from "react-router-dom";
import { Footer } from "./components/footer/footer";
import { Header } from "@/components/app-header/app-header";
import { Home } from "@/pages/home/home";
import { About } from "@/pages/about/about";
import { Blog } from "@/pages/blog/blog";
import { RemoveBackground } from "@/pages/remove-background/remove-background";
import { CanvasGame } from "@/pages/canvas-game/canvas-game";
import { Experiments } from "@/pages/experiments/experiments";
import { Timezones } from "./pages/timezones/timezones";
import { Resume } from "@/pages/resume/resume";

export const App = () => {
  return (
    <HashRouter basename={"/"}>
      <div className="content">
        <div className="home-container">
          <Header />
        </div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/blog" element={<Blog />} />

          {/* Experiments */}
          <Route path="/experiments" element={<Experiments />} />
          <Route path="/experiments/bg" element={<RemoveBackground />} />
          <Route path="/experiments/game" element={<CanvasGame />} />
          <Route path="/experiments/tz" element={<Timezones />} />

          {/* Old routes */}
          <Route path="/bg" element={<Navigate to="/experiments/bg" />} />
          <Route path="/game" element={<Navigate to="/experiments/game" />} />

          {/* Defaults */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Footer />
      </div>
    </HashRouter>
  );
};
