import React from "react";
import { useLocation } from "react-router-dom";
import { firstTouchAttribution } from "../../lib/attribution";

export function RouteAnalytics() {
  const location = useLocation();

  React.useEffect(() => {
    firstTouchAttribution();
  }, []);

  React.useEffect(() => {
    if (typeof window === "undefined" || !window.gtag || !window.__GA_ID__) return;
    const pagePath = `${location.pathname}${location.search}`;
    window.gtag("event", "page_view", {
      page_location: window.location.href,
      page_path: pagePath,
      page_title: document.title,
      send_to: window.__GA_ID__,
    });
  }, [location.pathname, location.search]);

  return null;
}
