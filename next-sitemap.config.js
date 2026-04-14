/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.devstackpro.cloud",
  generateRobotsTxt: true,
  exclude: ["/admin", "/admin/*", "/auth/*"],
  allowedDevOrigins: ["169.254.168.248"],
};
