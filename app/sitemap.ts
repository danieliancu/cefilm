import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "http://localhost:3000";

  const paths = ["/", "/alege-un-film", "/cum-functioneaza"];

  const lastModified = new Date();

  return paths.map((path) => ({
    url: path === "/" ? baseUrl : `${baseUrl}${path}`,
    lastModified,
    changefreq: "weekly"
  }));
}
