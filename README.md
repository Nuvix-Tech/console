# Nuvix Frontend Applications

This monorepo contains the frontend applications for **Nuvix** - an open source modern backend platform that provides built-in authentication, storage, messaging (email, push notifications, SMS), and easy-to-use database to REST API conversion.

![Nuvix Dashboard](apps/www/public/images/dashboard/hero_dark.png)

## 🌟 What is Nuvix?

Nuvix is a comprehensive backend-as-a-service platform that simplifies backend development by providing:

- 🔐 **Built-in Authentication** - User management, OAuth, and secure session handling
- 💾 **Storage Solutions** - File storage, database management, and data APIs  
- 📧 **Messaging Services** - Email, push notifications, and SMS capabilities
- 🚀 **Database-to-REST APIs** - Automatically generate REST APIs from your database schema
- ⚡ **Modern Architecture** - Built with performance, scalability, and developer experience in mind

This repository contains the frontend applications that provide the user interface for managing and interacting with Nuvix backend services.

## 🚀 Quick Start

### Prerequisites

- Node.js 20 or higher
- pnpm 10.13.1 or higher

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Nuvix-Tech/console.git
cd console
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development servers:
```bash
pnpm dev
```

## 📁 Project Structure

This is a monorepo containing multiple applications and shared packages:

### Applications (`apps/`)

- **`console/`** - Main dashboard/admin console for managing Nuvix backend services, built with Next.js
- **`docs/`** - Documentation website for Nuvix platform and APIs
- **`www/`** - Marketing and landing website for Nuvix platform, built with Vite and React Router

### Packages (`packages/`)

- **`cui/`** - Chakra UI components
- **`sui/`** - Shadcn UI components
- **`ui/`** - Once UI components
- **`pg-meta/`** - PostgreSQL metadata utilities
- **`eslint-config/`** - Shared ESLint configuration
- **`typescript-config/`** - Shared TypeScript configuration

## 🛠️ Development

### Available Scripts

- `pnpm dev` - Start all applications in development mode
- `pnpm build` - Build all applications for production
- `pnpm lint` - Run linting across all packages
- `pnpm format` - Format code using Biome

### Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **UI Libraries**: Chakra UI, Custom component libraries
- **Build Tools**: Turbo (monorepo), Vite, pnpm
- **Code Quality**: ESLint, Biome, TypeScript
- **Backend Integration**: PostgreSQL metadata utilities (pg-meta) for Nuvix backend services

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the BSD 3-Clause License. See the [LICENSE](./LICENSE) file for details.

## 🔗 Links

- [Documentation](./apps/docs)
- [Contributing Guidelines](./CONTRIBUTING.md)
- [Code of Conduct](./CODE_OF_CONDUCT.md)
- [Changelog](./CHANGELOG.md)

