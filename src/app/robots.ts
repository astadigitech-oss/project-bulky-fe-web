import type { MetadataRoute } from "next";
import { siteUrl } from "@/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        // Auth & akun pengguna — tidak berguna untuk SEO
        "/login",
        "/register",
        "/forgot-password",
        "/oauth",
        "/recovery",
        "/profile",
        "/checkout",
        "/cart",
        // Pagination dalam — konten duplikat, hemat crawl budget
        "/*/products?p=",
        "/*/products&p=",
        "/*/news?halaman=",
        "/*/news&halaman=",
        // Path khas scanner/bot jahat (bonus: kalau bot patuh robots.txt)
        "/wp-admin",
        "/wp-login.php",
        "/.env",
        "/.git",
        "/admin",
        "/administrator",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
