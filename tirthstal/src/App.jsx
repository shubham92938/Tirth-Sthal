import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar       from "./components/common/Navbar";
import Footer       from "./components/common/Footer";
import Home         from "./pages/index";
import Temples      from "./pages/temples/index";
import TempleDetail from "./pages/temples/[slug]";
import Festivals    from "./pages/festivals/index";
import DistrictPage from "./pages/districts/DistrictPage";
import ScrollToTop from "./pages/ScrollToTop";
import Blog       from "./pages/blog/index";
import BlogDetail from "./pages/blog/BlogDetail";
import MapPage from "./pages/map";
import "./styles/global/variables.css";
import "./styles/global/globals.css";
import About from "./pages/about/index";
import Contact from "./pages/contact/Contact";
export default function App() {
  return (
    <Router>
      <ScrollToTop/>
      <Navbar />
      <Routes>
        <Route path="/"                    element={<Home />}         />
        <Route path="/temples"             element={<Temples />}      />
        <Route path="/temples/:slug"       element={<TempleDetail />} />
        <Route path="/festivals"           element={<Festivals />}    />
        <Route path="/districts"           element={<DistrictPage />} />
        <Route path="/districts/:district" element={<DistrictPage />} />
        <Route path="/blog"        element={<Blog />}       />
        <Route path="/blog/:slug"  element={<BlogDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/contact"     element={<Contact />}/>
      </Routes>
      <Footer />
    </Router>
  );
}