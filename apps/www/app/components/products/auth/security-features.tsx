"use client";

import { useState, useEffect } from "react";
import {
    Column,
    Row,
    Text,
    Icon,
} from "@nuvix/ui/components";
import { motion, AnimatePresence } from "motion/react";

// --- Sub-Components ---

// 1. Interactive Session Manager
const SessionManager = () => {
    const [sessions, setSessions] = useState([
        { id: "1", user: "Walter O'Brien", device: "Macbook Pro", location: "New York, NY", status: "active", ip: "192.168.1.1" },
        { id: "2", user: "Walter O'Brien", device: "iPhone 14", location: "London, UK", status: "idle", ip: "10.0.0.42" },
        { id: "3", user: "Walter O'Brien", device: "iPad Air", location: "Tokyo, JP", status: "idle", ip: "172.16.0.1" },
    ]);

    const revokeSession = (id: string) => {
        setSessions((prev) => prev.filter((s) => s.id !== id));
    };

    return (
        <div className="h-full flex flex-col p-6">
            <Column gap="s" className="mb-6">
                <Row gap="s" vertical="center">
                    <div className="p-2 bg-brand-alpha-weak rounded-lg">
                        <Icon name="users" className="text-brand-solid-strong" size="s" />
                    </div>
                    <Text variant="heading-strong-s" as="h3">Active Sessions</Text>
                </Row>
                <Text variant="body-default-xs" onBackground="neutral-medium">
                    Real-time monitoring of user sessions across devices.
                </Text>
            </Column>

            <div className="flex-1 overflow-hidden rounded-xl border neutral-border-weak bg-neutral-background-subtle relative shadow-sm">
                <div className="grid grid-cols-12 gap-2 p-3 border-b neutral-border-weak bg-neutral-alpha-weak text-neutral-solid-medium text-[10px] uppercase tracking-wider font-semibold">
                    <div className="col-span-5">Device</div>
                    <div className="col-span-4">Location</div>
                    <div className="col-span-3 text-right">Action</div>
                </div>

                <div className="p-2">
                    <AnimatePresence mode="popLayout">
                        {sessions.map((s) => (
                            <motion.div
                                key={s.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                className="grid grid-cols-12 gap-2 p-3 items-center rounded-lg hover:bg-neutral-alpha-weak transition-colors group mb-1 last:mb-0"
                            >
                                <div className="col-span-5 flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${s.status === 'active' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-neutral-400'}`} />
                                    <Column gap="0">
                                        <Text variant="body-strong-xs">{s.device}</Text>
                                        <Text variant="label-default-xs" onBackground="neutral-medium">{s.ip}</Text>
                                    </Column>
                                </div>
                                <div className="col-span-4 flex items-center">
                                    <Text variant="body-default-xs" onBackground="neutral-medium">{s.location}</Text>
                                </div>
                                <div className="col-span-3 flex justify-end">
                                    <button
                                        onClick={() => revokeSession(s.id)}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-medium text-red-500 hover:text-red-600 px-3 py-1.5 rounded-md bg-red-500/10 hover:bg-red-500/20"
                                    >
                                        Revoke
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {sessions.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-12 text-center text-neutral-solid-medium flex flex-col items-center"
                        >
                            <Icon name="checkCircle" size="m" className="mb-3 text-green-500" />
                            <Text variant="body-default-s">All active sessions cleared</Text>
                            <button
                                onClick={() => setSessions([
                                    { id: "4", user: "Walter O'Brien", device: "Chrome / Windows", location: "Berlin, DE", status: "active", ip: "192.168.1.55" }
                                ])}
                                className="mt-4 text-xs text-brand-solid-strong hover:underline"
                            >
                                Refresh Mock Data
                            </button>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

// 2. Interactive Password Strength
const PasswordStrength = () => {
    const [password, setPassword] = useState("");

    const checks = [
        { label: "Minimum 8 characters", valid: password.length >= 8 },
        { label: "Contains at least one number", valid: /\d/.test(password) },
        { label: "Contains special character", valid: /[!@#$%^&*]/.test(password) },
        { label: "No common dictionary words", valid: !["password", "123456", "qwerty", "admin"].includes(password.toLowerCase()) && password.length > 0 }
    ];

    const strength = checks.filter(c => c.valid).length;

    return (
        <div className="h-full flex flex-col p-6">
            <Column gap="s" className="mb-6">
                <Row gap="s" vertical="center">
                    <div className="p-2 bg-brand-alpha-weak rounded-lg">
                        <Icon name="key" className="text-brand-solid-strong" size="s" />
                    </div>
                    <Text variant="heading-strong-s" as="h3">Password Policy</Text>
                </Row>
                <Text variant="body-default-xs" onBackground="neutral-medium">
                    Configurable complexity rules to ensure robust account security.
                </Text>
            </Column>

            <div className="flex-1 flex flex-col justify-center gap-8 px-4">
                <div className="max-w-md w-full mx-auto space-y-2">
                    <Text variant="label-default-xs" onBackground="neutral-medium">Test Password Policy</Text>
                    <div className="relative">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Type to test..."
                            className="w-full bg-neutral-background-subtle border neutral-border-medium rounded-lg px-4 py-3 text-base focus:ring-2 ring-brand-solid-strong outline-none transition-all shadow-sm"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            {strength === 4 ? (
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-green-500 bg-green-500/10 p-1 rounded-full">
                                    <Icon name="check" size="xs" />
                                </motion.div>
                            ) : (
                                <div className="w-2 h-2 rounded-full bg-neutral-solid-medium/30 transition-colors" />
                            )}
                        </div>
                    </div>
                    {/* Strength Meter Bar */}
                    <div className="h-1 bg-neutral-alpha-weak rounded-full overflow-hidden flex">
                        {[1, 2, 3, 4].map((step) => (
                            <motion.div
                                key={step}
                                initial={false}
                                animate={{
                                    opacity: strength >= step ? 1 : 0,
                                    width: "25%",
                                    backgroundColor: strength === 4 ? "#22c55e" : strength >= 2 ? "#eab308" : "#ef4444"
                                }}
                                className="h-full"
                            />
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg w-full mx-auto">
                    {checks.map((check) => (
                        <div key={check.label} className="flex items-center gap-3 p-3 rounded-lg border neutral-border-weak bg-neutral-background-subtle transition-colors"
                            style={{
                                borderColor: check.valid ? "rgba(34, 197, 94, 0.3)" : undefined,
                                backgroundColor: check.valid ? "rgba(34, 197, 94, 0.05)" : undefined,
                            }}
                        >
                            <motion.div
                                animate={{
                                    backgroundColor: check.valid ? "#22c55e" : "rgba(163, 163, 163, 0.2)",
                                    scale: check.valid ? 1 : 1
                                }}
                                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                            >
                                <Icon name="check" size="xs" className={`w-3.5 h-3.5 ${check.valid ? "text-white" : "text-transparent"}`} />
                            </motion.div>
                            <Text variant="label-default-xs" className="text-neutral-strong">
                                {check.label}
                            </Text>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// 3. MFA Visualizer
const MFAVisualizer = () => {
    const [progress, setProgress] = useState(100);
    const [code, setCode] = useState("492 581");

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((p) => {
                if (p <= 0) {
                    setCode(Math.floor(100000 + Math.random() * 900000).toString().replace(/(\d{3})(\d{3})/, "$1 $2"));
                    return 100;
                }
                return p - 0.5; // Slower, smoother update
            });
        }, 50);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="h-full flex flex-col p-6">
            <Column gap="s" className="mb-6">
                <Row gap="s" vertical="center">
                    <div className="p-2 bg-brand-alpha-weak rounded-lg">
                        <Icon name="shieldCheck" className="text-brand-solid-strong" size="s" />
                    </div>
                    <Text variant="heading-strong-s" as="h3">Multi-factor Authentication</Text>
                </Row>
                <Text variant="body-default-xs" onBackground="neutral-medium">
                    Seamless integration with TOTP apps like Google Authenticator and 1Password.
                </Text>
            </Column>

            <div className="flex-1 flex items-center justify-center bg-neutral-background-subtle border neutral-border-weak rounded-xl shadow-inner relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white dark:from-neutral-800 to-transparent opacity-50" />

                <div className="relative z-10 flex flex-col items-center gap-8">
                    {/* Phone/Device Frame Mock */}
                    <div className="w-64 bg-white dark:bg-neutral-900 rounded-2xl border neutral-border-medium shadow-2xl p-4 flex flex-col gap-4">
                        <div className="w-8 h-1 bg-neutral-200 dark:bg-neutral-700 rounded-full mx-auto" />

                        <div className="flex items-center gap-3 pb-4 border-b neutral-border-weak">
                            <div className="w-10 h-10 rounded bg-brand-solid-strong flex items-center justify-center text-white font-bold">N</div>
                            <Column gap="0">
                                <Text variant="label-strong-s">Nuvix Console</Text>
                                <Text variant="body-default-xs" onBackground="neutral-medium">ravikant@nuvix.com</Text>
                            </Column>
                        </div>

                        <div className="flex items-center justify-between py-2">
                            <Text variant="display-strong-m" className="font-mono tracking-wider tabular-nums text-brand-solid-strong">
                                {code}
                            </Text>
                            <div className="relative w-6 h-6 flex items-center justify-center">
                                <svg className="w-full h-full -rotate-90">
                                    <circle cx="12" cy="12" r="10" className="stroke-neutral-200 dark:stroke-neutral-800" strokeWidth="3" fill="none" />
                                    <motion.circle
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        className="stroke-brand-solid-strong"
                                        strokeWidth="3"
                                        fill="none"
                                        strokeDasharray="63"
                                        strokeDashoffset={63 - (63 * progress) / 100}
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </div>
                        </div>
                        <Text variant="body-default-xs" className="text-center text-neutral-400">
                            Code expires in {Math.ceil(progress / 10)}s
                        </Text>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 4. Global Policies
const SecurityPolicies = () => {
    return (
        <div className="h-full flex flex-col p-6">
            <Column gap="s" className="mb-6">
                <Row gap="s" vertical="center">
                    <div className="p-2 bg-brand-alpha-weak rounded-lg">
                        <Icon name="settings" className="text-brand-solid-strong" size="s" />
                    </div>
                    <Text variant="heading-strong-s" as="h3">Global Policies</Text>
                </Row>
                <Text variant="body-default-xs" onBackground="neutral-medium">
                    Configure organization-wide security thresholds and blocklists.
                </Text>
            </Column>

            <div className="space-y-6">
                {/* Session Limit */}
                <div className="p-5 rounded-xl border neutral-border-weak bg-neutral-background-subtle">
                    <div className="flex items-center justify-between mb-2">
                        <Column gap="xs">
                            <Text variant="heading-strong-xs">Max Concurrent Sessions</Text>
                            <Text variant="body-default-xs" onBackground="neutral-medium">Limit active sessions per user.</Text>
                        </Column>
                        <div className="flex items-center gap-4 bg-white dark:bg-neutral-900 rounded-lg p-1 border neutral-border-weak">
                            <button className="w-8 h-8 flex items-center justify-center hover:bg-neutral-alpha-weak rounded transition-colors">
                                <Icon name="minus" size="xs" />
                            </button>
                            <Text variant="body-strong-s">10</Text>
                            <button className="w-8 h-8 flex items-center justify-center hover:bg-neutral-alpha-weak rounded transition-colors">
                                <Icon name="plus" size="xs" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Dictionary */}
                <div className="p-5 rounded-xl border neutral-border-weak bg-neutral-background-subtle">
                    <Column gap="xs" className="mb-4">
                        <Text variant="heading-strong-xs">Password Blocklist</Text>
                        <Text variant="body-default-xs" onBackground="neutral-medium">Automatically reject compromised or common passwords.</Text>
                    </Column>
                    <div className="w-full bg-white dark:bg-neutral-900 border neutral-border-weak rounded-lg p-3 flex flex-wrap gap-2 min-h-[100px] content-start">
                        {["password", "123456", "admin", "welcome", "qwerty", "secret", "football", "dragon"].map(w => (
                            <span key={w} className="px-2 py-1 bg-red-500/5 text-red-600 text-xs rounded-md font-medium border border-red-500/10 flex items-center gap-1">
                                {w}
                                <Icon name="x" size="xs" className="w-3 h-3 opacity-50 cursor-pointer hover:opacity-100" />
                            </span>
                        ))}
                        <div className="px-2 py-1 text-neutral-400 text-xs border border-dashed border-neutral-300 rounded-md cursor-pointer hover:border-neutral-400 hover:text-neutral-500 transition-colors">
                            + Add word
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// --- Main Layout ---

const FEATURES = [
    { id: "sessions", label: "Session Management", description: "Monitor and revoke active sessions", icon: "users", component: <SessionManager /> },
    { id: "password", label: "Password Strength", description: "Enforce complexity rules", icon: "key", component: <PasswordStrength /> },
    { id: "mfa", label: "Multi-factor Auth", description: "TOTP and 2FA Support", icon: "shieldCheck", component: <MFAVisualizer /> },
    { id: "policies", label: "Global Policies", description: "Session limits and blocklists", icon: "settings", component: <SecurityPolicies /> },
];

export const SecurityFeatures = () => {
    const [activeTab, setActiveTab] = useState(FEATURES[0].id);

    return (
        <section className="w-full py-24 relative overflow-hidden bg-neutral-background-weak/30">
            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-alpha-weak border border-brand-solid-strong/20 mb-6">
                        <Icon name="shield" size="xs" className="text-brand-solid-strong" />
                        <Text variant="label-strong-xs" className="text-brand-solid-strong">Enterprise Grade</Text>
                    </div>

                    <Text variant="display-strong-s" as="h2" className="mb-4">
                        Advanced Security, Built-in
                    </Text>
                    <Text variant="body-default-m" onBackground="neutral-medium">
                        Protect your users with industry-standard security features without writing a single line of complex auth code.
                    </Text>
                </div>

                {/* Feature Spotlight Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

                    {/* Left Sidebar (Navigation) */}
                    <div className="lg:col-span-4 flex flex-col gap-2">
                        {FEATURES.map((feature) => (
                            <button
                                key={feature.id}
                                onClick={() => setActiveTab(feature.id)}
                                className={`text-left p-4 rounded-xl transition-all duration-300 border group relative overflow-hidden ${activeTab === feature.id
                                    ? "bg-white dark:bg-neutral-800 border-neutral-border-strong shadow-md scale-[1.02]"
                                    : "bg-transparent border-transparent hover:bg-neutral-alpha-weak"
                                    }`}
                            >
                                {activeTab === feature.id && (
                                    <motion.div
                                        layoutId="active-pill"
                                        className="absolute inset-0 border-2 border-brand-solid-strong rounded-xl pointer-events-none"
                                        transition={{ duration: 0.3 }}
                                    />
                                )}
                                <Row gap="m" vertical="center">
                                    <div className={`p-2 rounded-lg transition-colors ${activeTab === feature.id
                                        ? "bg-brand-solid-strong text-white"
                                        : "bg-neutral-alpha-medium text-neutral-solid-medium group-hover:bg-neutral-alpha-strong group-hover:text-neutral-strong"
                                        }`}>
                                        <Icon name={feature.icon as any} size="s" />
                                    </div>
                                    <Column gap="0">
                                        <Text variant="heading-strong-xs" className={activeTab === feature.id ? "text-neutral-strong" : "text-neutral-medium group-hover:text-neutral-strong"}>
                                            {feature.label}
                                        </Text>
                                        <Text variant="body-default-xs" className={activeTab === feature.id ? "text-neutral-medium" : "text-neutral-weak"}>
                                            {feature.description}
                                        </Text>
                                    </Column>
                                </Row>
                            </button>
                        ))}
                    </div>

                    {/* Right Stage (Preview) */}
                    <div className="lg:col-span-8">
                        <div className="h-[520px] bg-white dark:bg-neutral-900 rounded-2xl border neutral-border-weak shadow-lg overflow-hidden relative">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                    className="h-full w-full"
                                >
                                    {FEATURES.find(f => f.id === activeTab)?.component}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};
