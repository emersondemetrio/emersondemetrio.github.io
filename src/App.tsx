import "react";
import "./App.css";
import {
  Route,
  Routes,
  Navigate,
  HashRouter
} from "react-router-dom";
import { Home } from "./pages/home/home";
import { Footer } from "./components/footer/footer";

const About = () => {
  return (
    <section className="page-section">
      <h2>About</h2>
    </section>
  );
};

export const App = () => {
  return (
    <HashRouter basename={"/"}>
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Footer />
      </div>
    </HashRouter>
  );
};
