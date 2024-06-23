import "react";
import "./index.css";
import {
  Route,
  Routes,
  Navigate,
  HashRouter
} from "react-router-dom";
import { Footer } from "./components/footer/footer";
import { Header } from "@/components/app-header/app-header";
import { Home } from "@/pages/home/home";
import { About } from "@/pages/about/about";
import { Blog } from "@/pages/blog/blog";
import { RemoveBackground } from "@/pages/remove-background/remove-background";

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
          <Route path="/blog" element={<Blog />} />
          <Route path="/bg" element={<RemoveBackground />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Footer />
      </div>
    </HashRouter>
  );
};
