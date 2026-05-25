import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/common/Navbar";
import Home   from "./pages/index";
import Footer from "./components/common/Footer";
import Temples from "./pages/temples/index";
import "./styles/global/variables.css";
import "./styles/global/globals.css";
import TempleDetail from "./pages/temples/[slug]";
import Festivals from "./pages/festivals/index"

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/temples" element={<Temples />} />
        <Route path="/temples/:slug" element={<TempleDetail />} />
        <Route path="/festivals" element={<Festivals />} />
      </Routes>
      <Footer/>
    </Router>
  );
}