import "react";
import "./index.css";
import { ToastContainer } from "react-toastify";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { Footer } from "./components/footer/footer";
import { Home } from "@/pages/home/home";
import { Blog } from "@/pages/blog/blog";
import { RemoveBackground } from "@/pages/remove-background/remove-background";
import { CanvasGame } from "@/pages/canvas-game/canvas-game";
import { Resume } from "@/pages/resume/resume";
import { Navbar } from "./components/navbar/Navbar";
import { WeatherApp } from "./pages/weather-app/weather-app";
import { CodePen } from "./pages/code-pen/code-pen";
import { Countdown } from "./pages/countdown/countdown";
import { Camera } from "./pages/camera/camera";
import { DevDaily } from "./pages/dev-daily/dev-daily";
import { Pasteable } from "./pages/pasteable/pasteable";

const oldRoutes = [
  {
    from: ["/bg", "experiment/bg"],
    to: "/labs/bg",
  },
  {
    from: ["/game", "/experiment/game"],
    to: "/labs/game",
  },
  {
    from: "/experiments/timezones",
    to: "/labs/timezones",
  },
]
  .map(({ from, to }) => {
    if (typeof from === "string") return { from, to };

    return from.map((path) => ({ from: path, to }));
  })
  .flat();

export const App = () => {
  return (
    <HashRouter basename={"/"}>
      <div className="grid min-h-[100dvh] grid-rows-[auto_1fr_auto]">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<Resume />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/dev" element={<DevDaily />} />
            <Route path="/pasteable" element={<Pasteable />} />
            <Route path="/paste" element={<Pasteable />} />

            {/* Experiments */}
            <Route path="/labs/background" element={<RemoveBackground />} />
            <Route path="/labs/game" element={<CanvasGame />} />
            <Route path="/labs/timezones" element={<WeatherApp />} />
            <Route path="/labs/weather" element={<WeatherApp />} />
            <Route path="/labs/code-pen" element={<CodePen />} />
            <Route path="/labs/countdown" element={<Countdown />} />
            <Route path="/labs/paste" element={<Pasteable />} />
            <Route path="/labs/pasteable" element={<Pasteable />} />
            <Route
              path="/labs/countdown/:id/:countdownName?"
              element={<Countdown />}
            />
            <Route path="/labs/camera" element={<Camera />} />
            {/* Old routes */}
            {oldRoutes.map(({ from, to }) => (
              <Route
                key={`${from}-${to}`}
                path={from}
                element={<Navigate to={to} />}
              />
            ))}

            {/* Defaults */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <ToastContainer />
        <Footer />
      </div>
    </HashRouter>
  );
};
