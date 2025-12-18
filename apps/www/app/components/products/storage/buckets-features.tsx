import { Text } from "@nuvix/ui/components";

export const BucketsFeatures = () => {
    return (
        <div className="w-full py-32">
            <div className="max-w-7xl mx-auto px-6">
                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
                    {/* Left Side - Statement */}
                    <div className="lg:col-span-2">
                        <Text variant="display-strong-l" as="h2" onBackground="neutral-strong" className="mb-6">
                            Organize with buckets
                        </Text>
                        <Text variant="body-default-l" onBackground="neutral-medium" className="mb-8">
                            Like folders, but smarter. Each bucket gets its own permissions, file restrictions,
                            and security settings.
                        </Text>

                        {/* Quick Stats */}
                        <div className="space-y-4">
                            <div className="flex items-baseline gap-3">
                                <Text variant="display-strong-m" onBackground="brand-strong">
                                    2
                                </Text>
                                <Text variant="body-default-m" onBackground="neutral-medium">
                                    permission levels (bucket + file)
                                </Text>
                            </div>
                            <div className="flex items-baseline gap-3">
                                <Text variant="display-strong-m" onBackground="brand-strong">
                                    ∞
                                </Text>
                                <Text variant="body-default-m" onBackground="neutral-medium">
                                    buckets per project
                                </Text>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Code & Features */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Code Example */}
                        <div className="neutral-background-weak rounded-sm p-6 border-2 neutral-border-medium">
                            <Text variant="label-default-xs" onBackground="neutral-strong" className="mb-4">
                                Create a bucket with restrictions
                            </Text>
                            <pre className="text-sm neutral-on-background-medium font-mono leading-relaxed overflow-x-auto">
                                <code>{`await nx.storage.createBucket({
  bucketId: ID.unique(),
  name: 'Avatars',
  maximumFileSize: 5000000,     // 5MB max
  allowedFileExtensions: [
    'jpg', 'png', 'webp'        // Images only
  ],
  fileSecurity: true,            // Per-file permissions
  encryption: true               // Encrypt at rest
});`}</code>
                            </pre>
                        </div>

                        {/* What you can control */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="neutral-background-alpha-weak rounded-sm p-6 border neutral-border-weak">
                                <Text variant="label-strong-m" onBackground="neutral-strong" className="mb-2">
                                    Access control
                                </Text>
                                <Text variant="body-default-s" onBackground="neutral-medium" as="p">
                                    Public, private, or custom permissions. Lock down at bucket or file level.
                                </Text>
                            </div>

                            <div className="neutral-background-alpha-weak rounded-sm p-6 border neutral-border-weak">
                                <Text variant="label-strong-m" onBackground="neutral-strong" className="mb-2">
                                    File restrictions
                                </Text>
                                <Text variant="body-default-s" onBackground="neutral-medium" as="p">
                                    Limit by size and type. Only accept what your app needs.
                                </Text>
                            </div>

                            <div className="neutral-background-alpha-weak rounded-sm p-6 border neutral-border-weak">
                                <Text variant="label-strong-m" onBackground="neutral-strong" className="mb-2">
                                    Encryption
                                </Text>
                                <Text variant="body-default-s" onBackground="neutral-medium" as="p">
                                    Enable encryption for sensitive files. Automatic at rest.
                                </Text>
                            </div>

                            <div className="neutral-background-alpha-weak rounded-sm p-6 border neutral-border-weak">
                                <Text variant="label-strong-m" onBackground="neutral-strong" className="mb-2">
                                    Compression
                                </Text>
                                <Text variant="body-default-s" onBackground="neutral-medium" as="p">
                                    Optional compression to save bandwidth and storage.
                                </Text>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
