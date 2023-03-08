type SitemapItem = {
  url: string;
  changefreq: string;
  priority: number;
};
const sitemap: SitemapItem[] = [
  { url: "/login", changefreq: "monthly", priority: 0.3 },
  { url: "/register", changefreq: "monthly", priority: 0.3 },
  { url: "/shopware", changefreq: "monthly", priority: 0.3 },
];

export default sitemap;
