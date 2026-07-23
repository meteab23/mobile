/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;

// Enable Cloudflare bindings (KV, D1, R2, etc.) during `next dev` when
// developing against the Cloudflare platform via @cloudflare/next-on-pages.
if (process.env.NODE_ENV === "development") {
  try {
    const { setupDevPlatform } = await import(
      "@cloudflare/next-on-pages/next-dev"
    );
    await setupDevPlatform();
  } catch {
    // next-on-pages not installed or not needed for standard `next dev`
  }
}
