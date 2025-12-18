import { Column, Text } from "@nuvix/ui/components";

export const ImageTransformations = () => {
  return (
    <div className="w-full py-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-20">
          <Text variant="display-strong-l" as="h2" onBackground="neutral-strong" className="mb-6">
            Image transformations
            <br />
            via URL
          </Text>
          <Text variant="body-default-l" onBackground="neutral-medium" className="max-w-2xl">
            No image processing server needed. Just add parameters to the URL. Resize, crop, convert
            formats - all cached automatically.
          </Text>
        </div>

        {/* Visual Examples */}
        <div className="space-y-12">
          {/* Example 1: Resize */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-block px-4 py-2 rounded-full neutral-background-alpha-medium mb-4">
                <Text variant="label-strong-s" onBackground="neutral-strong">
                  Resize on-the-fly
                </Text>
              </div>
              <Text
                variant="heading-strong-l"
                as="h3"
                onBackground="neutral-strong"
                className="mb-4"
              >
                ?width=800
              </Text>
              <Text variant="body-default-m" onBackground="neutral-medium" className="mb-6">
                Add width or height params. Images scale automatically while preserving aspect
                ratio.
              </Text>
              <div className="flex flex-wrap gap-3">
                {["width=400", "height=300", "gravity=center"].map((param) => (
                  <code className="px-4 py-2 rounded-sm accent-background-alpha-medium font-mono text-sm accent-on-background-medium">
                    {param}
                  </code>
                ))}
              </div>
            </div>
            <div
              data-theme="dark"
              className="rounded-sm page-background p-8 border-2 border-neutral-weak"
            >
              <pre className="text-sm neutral-on-background-medium font-mono leading-relaxed overflow-x-auto">
                <code>{`// Original image URL
getFileViewURL({
  bucketId: 'photos',
  fileId: 'image.jpg'
})

// Add transformations
getFilePreviewURL({
  bucketId: 'photos',
  fileId: 'image.jpg',
  width: 800,        // Resize to 800px wide
  gravity: 'center'  // Crop from center
})`}</code>
              </pre>
            </div>
          </div>

          {/* Example 2: Format Conversion */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="order-2 lg:order-1">
              <div
                data-theme="dark"
                className="rounded-sm page-background p-8 border-2 border-neutral-weak"
              >
                <pre className="text-sm neutral-on-background-medium font-mono leading-relaxed overflow-x-auto">
                  <code>{`// Convert to WebP for smaller size
getFilePreviewURL({
  bucketId: 'photos',
  fileId: 'large.png',  // PNG source
  output: 'webp',       // Convert to WebP
  quality: 90           // Keep quality high
})

// Result: 70% smaller file size`}</code>
                </pre>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-block px-4 py-2 rounded-full neutral-background-alpha-medium mb-4">
                <Text variant="label-strong-s" onBackground="neutral-strong">
                  Format conversion
                </Text>
              </div>
              <Text
                variant="heading-strong-l"
                as="h3"
                onBackground="neutral-strong"
                className="mb-4"
              >
                ?output=webp
              </Text>
              <Text variant="body-default-m" onBackground="neutral-medium" className="mb-6">
                Convert between formats instantly. Perfect for modern formats like WebP and AVIF.
              </Text>
              <div className="flex flex-wrap gap-3">
                {["output=webp", "output=avif", "quality=90"].map((param) => (
                  <code className="px-4 py-2 rounded-sm brand-background-alpha-medium font-mono text-sm brand-on-background-medium">
                    {param}
                  </code>
                ))}
              </div>
            </div>
          </div>

          {/* Example 3: Styling */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-block px-4 py-2 rounded-full neutral-background-alpha-medium mb-4">
                <Text variant="label-strong-s" onBackground="neutral-strong">
                  Borders & styling
                </Text>
              </div>
              <Text
                variant="heading-strong-l"
                as="h3"
                onBackground="neutral-strong"
                className="mb-4"
              >
                ?borderRadius=100
              </Text>
              <Text variant="body-default-m" onBackground="neutral-medium" className="mb-6">
                Add borders, rounded corners, backgrounds. Perfect for avatars and thumbnails.
              </Text>
              <div className="flex flex-wrap gap-3">
                {["borderRadius=20", "borderWidth=5", "borderColor=000"].map((param) => (
                  <code className="px-4 py-2 rounded-sm neutral-background-alpha-weak font-mono text-sm neutral-on-background-medium">
                    {param}
                  </code>
                ))}
              </div>
            </div>
            <div
              data-theme="dark"
              className="rounded-sm page-background p-8 border-2 border-neutral-weak"
            >
              <pre className="text-sm neutral-on-background-medium font-mono leading-relaxed overflow-x-auto">
                <code>{`// Create circular avatar
getFilePreviewURL({
  bucketId: 'avatars',
  fileId: 'user.jpg',
  width: 200,
  height: 200,
  borderRadius: 100,  // Fully rounded
  borderWidth: 4,
  borderColor: '3B82F6'
})`}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Bottom Note */}
        <div
          data-theme="dark"
          className="mt-20 p-8 page-background rounded-lg border-2 neutral-border-weak"
        >
          <Column gap="s">
            <Text variant="heading-strong-m" as="h4" onBackground="neutral-strong">
              All transformations are cached
            </Text>
            <Text variant="body-default-m" onBackground="neutral-medium">
              First request processes the image. Every request after that is served from cache -
              both on our CDN and in browsers. Fast and efficient by default.
            </Text>
          </Column>
        </div>
      </div>
    </div>
  );
};
