import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Layout from "./components/Layout/Layout";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ProductPage from "./pages/ProductPage";
import TeamPage from "./pages/TeamPage";
import ContactPage from "./pages/ContactPage";
import PrivacyPage from "./pages/PrivacyPage";
import AwwwardsLandingPage from "./pages/AwwwardsLandingPage";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <HelmetProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/product" element={<ProductPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/awwwards" element={<AwwwardsLandingPage />} />
          </Routes>
        </Layout>
      </Router>
    </HelmetProvider>
  </StrictMode>,
);
