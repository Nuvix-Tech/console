"use client";

import { Column, Row, Text, Icon } from "@nuvix/ui/components";
import { Upload } from "lucide-react";

export const FileManagement = () => {
  const fileTypes = [
    { ext: "JPG", color: "bg-blue-500" },
    { ext: "PNG", color: "bg-purple-500" },
    { ext: "PDF", color: "bg-red-500" },
    { ext: "MP4", color: "bg-orange-500" },
    { ext: "WEBP", color: "bg-green-500" },
    { ext: "GIF", color: "bg-pink-500" },
    { ext: "ZIP", color: "bg-yellow-500" },
    { ext: "SVG", color: "bg-teal-500" },
  ];

  return (
    <div className="w-full py-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main Statement */}
        <div className="mb-24">
          <Text variant="display-strong-l" as="h2" onBackground="neutral-strong" className="mb-6">
            Upload anything.
            <br />
            Store everything.
          </Text>
          <Text variant="body-default-l" onBackground="neutral-medium" className="max-w-2xl">
            From profile pictures to 4K videos. 5MB or 5GB. We handle the chunking, compression, and
            delivery automatically.
          </Text>
        </div>

        {/* File Types Visual */}
        <div className="mb-20">
          <div className="flex flex-wrap gap-3 mb-8">
            {fileTypes.map((type) => (
              <div
                key={type.ext}
                className={`${type.ext === "JPG" ? "scale-110" : ""} px-6 py-3 rounded-md ${type.color} text-white font-mono font-bold text-sm shadow-lg`}
              >
                .{type.ext.toLowerCase()}
              </div>
            ))}
            <div className="px-6 py-3 rounded-md bg-gradient-to-r from-gray-400 to-gray-500 text-white font-mono font-bold text-sm shadow-lg">
              + more
            </div>
          </div>
          <Text variant="body-default-s" onBackground="neutral-medium">
            All file types supported. No restrictions, no limits.
          </Text>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          {/* Left: Upload */}
          <div>
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full neutral-background-alpha-medium mb-4">
                <Icon name={Upload} size="s" className="neutral-on-solid-strong" />
                <Text variant="label-strong-s" onBackground="neutral-strong">
                  Upload
                </Text>
              </div>
              <Text
                variant="heading-strong-l"
                as="h3"
                onBackground="neutral-strong"
                className="mb-4"
              >
                Chunked automatically
              </Text>
              <Text variant="body-default-m" onBackground="neutral-medium">
                Files over 5MB are automatically split into chunks. Resumable if connection drops.
                Works from browser, server, or mobile.
              </Text>
            </div>

            <div className="neutral-background-alpha-medium rounded-lg p-6 border-2 neutral-border-weak">
              <pre className="text-sm neutral-on-solid-weak font-mono leading-relaxed overflow-x-auto">
                <code>{`// Just pass the file - we handle the rest
const file = input.files[0];

await nx.storage.createFile({
  bucketId: 'uploads',
  fileId: ID.unique(),
  file: file  // 5MB or 5GB, doesn't matter
});`}</code>
              </pre>
            </div>
          </div>

          {/* Right: Transform */}
          <div>
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full neutral-background-alpha-medium mb-4">
                <Icon name="image" size="s" className="neutral-on-solid-strong" />
                <Text variant="label-strong-s" onBackground="neutral-strong">
                  Transform
                </Text>
              </div>
              <Text
                variant="heading-strong-l"
                as="h3"
                onBackground="neutral-strong"
                className="mb-4"
              >
                On-the-fly processing
              </Text>
              <Text variant="body-default-m" onBackground="neutral-medium">
                Resize, crop, convert formats. All via URL parameters. Original stays untouched.
                Results are cached.
              </Text>
            </div>

            <div className="neutral-background-alpha-medium rounded-lg p-6 border-2 neutral-border-weak">
              <pre className="text-sm neutral-on-solid-weak font-mono leading-relaxed overflow-x-auto">
                <code>{`// Transform images on demand
const url = nx.storage.getFilePreviewURL({
  bucketId: 'photos',
  fileId: 'hero.jpg',
  width: 1200,
  quality: 90,
  output: 'webp'  // Auto-convert to WebP
});`}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Bottom Feature Highlight */}
        <div className="neutral-background-alpha-weak rounded-xl p-12 border-2 neutral-border-medium">
          <Row gap="xl" className="items-center flex-wrap lg:flex-nowrap">
            <div className="flex-1">
              <Text
                variant="heading-strong-m"
                as="h3"
                onBackground="neutral-strong"
                className="mb-4"
              >
                Global CDN included
              </Text>
              <Text variant="body-default-m" onBackground="neutral-medium">
                Every file is automatically distributed across our global CDN. Low latency downloads
                for users anywhere in the world. No setup required.
              </Text>
            </div>
            <div className="flex gap-8">
              <Column gap="xs">
                <Text variant="display-strong-m" onBackground="brand-strong">
                  &lt;50ms
                </Text>
                <Text variant="label-default-s" onBackground="neutral-medium">
                  First byte
                </Text>
              </Column>
              <Column gap="xs">
                <Text variant="display-strong-m" onBackground="brand-strong">
                  99.9%
                </Text>
                <Text variant="label-default-s" onBackground="neutral-medium">
                  Uptime SLA
                </Text>
              </Column>
            </div>
          </Row>
        </div>
      </div>
    </div>
  );
};
