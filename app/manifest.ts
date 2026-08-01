import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Perez Rough Framing",
    short_name: "Perez Framing",
    description: "Bay Area rough and structural framing contractor.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf8f3",
    theme_color: "#101513",
    icons: [{ src: "/assets/logo-mark.png", sizes: "512x512", type: "image/png" }],
  };
}
