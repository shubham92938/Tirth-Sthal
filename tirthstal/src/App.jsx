import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import Loader from "./components/common/Loader";
import ScrollToTop from "./pages/ScrollToTop";
import { ProtectedRoute } from "./components/ProtectedRoute";
import "./styles/global/variables.css";
import "./styles/global/globals.css";

// ── Pages are code-split: each route loads only when visited,
//    so the first paint ships a much smaller bundle ──
const Home           = lazy(() => import("./pages/index"));
const Temples        = lazy(() => import("./pages/temples/index"));
const TempleDetail   = lazy(() => import("./pages/temples/[slug]"));
const Festivals      = lazy(() => import("./pages/festivals/index"));
const DistrictPage   = lazy(() => import("./pages/districts/DistrictPage"));
const Blog           = lazy(() => import("./pages/blog/index"));
const BlogDetail     = lazy(() => import("./pages/blog/BlogDetail"));
const MapPage        = lazy(() => import("./pages/map"));
const Favorites      = lazy(() => import("./pages/favorites/index"));
const About          = lazy(() => import("./pages/about/index"));
const Contact        = lazy(() => import("./pages/contact/Contact"));
const Goseva         = lazy(() => import("./pages/goseva/index"));
const Login          = lazy(() => import("./pages/auth/login"));
const Signup         = lazy(() => import("./pages/auth/signup"));
const Profile        = lazy(() => import("./pages/auth/myprofile"));
const ForgotPassword = lazy(() => import("./pages/auth/forgotPassword"));
const ResetPassword  = lazy(() => import("./pages/auth/reset-password"));
const NotFound       = lazy(() => import("./pages/NotFound"));

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Navbar />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/"                    element={<Home />}         />
          <Route path="/temples"             element={<Temples />}      />
          <Route path="/temples/:slug"       element={<TempleDetail />} />
          <Route path="/festivals"           element={<Festivals />}    />
          <Route path="/districts"           element={<DistrictPage />} />
          <Route path="/districts/:district" element={<DistrictPage />} />
          <Route path="/blog"                element={<Blog />}         />
          <Route path="/blog/:slug"          element={<BlogDetail />}   />
          <Route path="/goseva"              element={<Goseva />}       />
          <Route path="/about"               element={<About />}        />
          <Route path="/map"                 element={<MapPage />}      />
          <Route path="/favorites"           element={<Favorites />}    />
          <Route path="/contact"             element={<Contact />}      />
          <Route path="/auth/login"          element={<Login />}        />
          <Route path="/auth/signup"         element={<Signup />}       />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/auth/forgot"                element={<ForgotPassword />} />
          <Route path="/auth/reset-password/:token" element={<ResetPassword />}  />
          <Route path="*"                           element={<NotFound />}       />
        </Routes>
      </Suspense>
      <Footer />
    </Router>
  );
}
