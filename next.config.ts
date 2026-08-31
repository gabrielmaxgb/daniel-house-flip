import type { NextConfig } from "next"

function r2RemotePattern() {
  const url = process.env.NEXT_PUBLIC_R2_PUBLIC_URL
  if (!url) return null

  try {
    const { protocol, hostname } = new URL(url)
    if (protocol !== "https:" && protocol !== "http:") return null

    return {
      protocol: protocol.replace(":", "") as "https" | "http",
      hostname,
      pathname: "/**" as const,
    }
  } catch {
    return null
  }
}

const r2Pattern = r2RemotePattern()

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      ...(r2Pattern ? [r2Pattern] : []),
    ],
  },
}

export default nextConfig
