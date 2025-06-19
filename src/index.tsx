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
import BlogPage from "./pages/BlogPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import BlogTagPage from "./pages/BlogTagPage";
import BlogSearchPage from "./pages/BlogSearchPage";
import RSSFeedPage from "./pages/RSSFeedPage";

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
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/search" element={<BlogSearchPage />} />
            <Route path="/blog/tags/:tag" element={<BlogTagPage />} />
            <Route path="/blog/rss.xml" element={<RSSFeedPage />} />
            <Route path="/blog/:slug" element={<BlogDetailPage />} />
          </Routes>
        </Layout>
      </Router>
    </HelmetProvider>
  </StrictMode>,
);
