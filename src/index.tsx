import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
// Design system English accent font (Space Grotesk, latin subset only).
import "@fontsource/space-grotesk/latin-500.css";
import "@fontsource/space-grotesk/latin-700.css";
// Design system tokens (color/spacing/radius/typography scale + inverse theme).
import "./design/tokens.css";
import { MotionProvider } from "./motion/MotionProvider";
import { WedgeOverlay } from "./components/motion/Wedge";
import Layout from "./components/Layout/Layout";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ProductPage from "./pages/ProductPage";
import TeamPage from "./pages/TeamPage";
import ContactPage from "./pages/ContactPage";
import PrivacyPage from "./pages/PrivacyPage";
import CaseStudiesPage from "./pages/CaseStudiesPage";
import ReviewAIPage from "./pages/ReviewAIPage";
import HotelPage from "./pages/HotelPage";
import D2CPage from "./pages/D2CPage";

// DEV-only primitive catalog. Lazily imported so it stays out of prod bundles.
const MotionLab = import.meta.env.DEV
  ? lazy(() => import("./pages/_lab/MotionLab"))
  : null;

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <HelmetProvider>
      <Router>
        <MotionProvider>
        <Layout>
          <WedgeOverlay>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/product" element={<ProductPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/case-studies" element={<CaseStudiesPage />} />
            <Route path="/review-ai" element={<ReviewAIPage />} />
            <Route path="/hotel" element={<HotelPage />} />
            <Route path="/hotels" element={<HotelPage />} />
            <Route path="/hasip" element={<HotelPage />} />
            <Route path="/d2c" element={<D2CPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            {MotionLab && (
              <Route
                path="/_lab"
                element={
                  <Suspense fallback={null}>
                    <MotionLab />
                  </Suspense>
                }
              />
            )}
          </Routes>
          </WedgeOverlay>
        </Layout>
        </MotionProvider>
      </Router>
    </HelmetProvider>
  </StrictMode>,
);
