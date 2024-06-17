import "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Home } from "./pages/home/home";
import Footer from "./components/footer";
import Header from "./components/header";

const About = () => {
  return (
    <section className="page-section">
      <h2>About</h2>
    </section>
  );
};

export const App = () => {
  return (
    <Router basename={"/"}>
      <div className="content">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};
