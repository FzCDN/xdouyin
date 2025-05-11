import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add meta tags for better SEO
const metaDescription = document.createElement('meta');
metaDescription.name = 'description';
metaDescription.content = 'TikTok clone with video streaming capabilities, supporting both m3u8 and mp4 formats';
document.head.appendChild(metaDescription);

// Add title
const title = document.createElement('title');
title.textContent = 'TikTok Clone';
document.head.appendChild(title);

createRoot(document.getElementById("root")!).render(<App />);
