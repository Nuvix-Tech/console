/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    compiler: "modern",
    silenceDeprecations: ["legacy-js-api"],
  },
  images: [
    {
      hostname: "skil.collegejaankaar.in"
    }
  ]
};

export default nextConfig;
