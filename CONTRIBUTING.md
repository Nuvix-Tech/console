# Contributing to Nuvix

Thank you for your interest in contributing to Nuvix! We welcome contributions from the community to help make Nuvix the best open source backend platform.

## 🤝 How to Contribute

### Reporting Issues

- Use the GitHub Issues tab to report bugs or request features
- Check existing issues before creating a new one
- Provide clear, detailed descriptions with reproduction steps
- Include relevant environment information (OS, Node.js version, etc.)

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/console.git
   cd console
   ```

2. **Install Dependencies**
   ```bash
   pnpm install
   ```

3. **Start Development**
   ```bash
   pnpm dev
   ```

### Making Changes

1. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Follow Code Standards**
   - Use TypeScript for all new code
   - Follow existing code style and patterns
   - Run `pnpm lint` to check for linting errors
   - Run `pnpm format` to format your code
   - Ensure type safety with `pnpm type-check`

3. **Test Your Changes**
   - Test in multiple browsers if UI changes
   - Ensure all existing functionality still works
   - Add tests for new features when applicable

4. **Commit Guidelines**
   Use conventional commit messages:
   ```bash
   git commit -m "feat: add new authentication flow"
   git commit -m "fix: resolve dashboard loading issue"
   git commit -m "docs: update installation instructions"
   ```

### Pull Request Process

1. **Before Submitting**
   - Ensure your branch is up to date with main
   - Run all linting and formatting checks
   - Write clear, descriptive commit messages

2. **Submit Pull Request**
   - Use a clear, descriptive title
   - Include a detailed description of changes
   - Reference any related issues
   - Add screenshots for UI changes

3. **Review Process**
   - Maintainers will review your PR
   - Address any requested changes
   - Once approved, your PR will be merged

## 🏗️ Project Structure

- **Frontend Applications**: Located in `apps/` directory
  - `console/` - Main Nuvix dashboard
  - `docs/` - Documentation site
  - `www/` - Marketing website

- **Shared Packages**: Located in `packages/` directory
  - `ui/`, `cui/`, `sui/` - UI component libraries
  - `pg-meta/` - PostgreSQL utilities
  - Config packages for TypeScript and ESLint

## 🎯 Areas for Contribution

### High Priority
- 🐛 Bug fixes and stability improvements
- 📚 Documentation improvements
- 🎨 UI/UX enhancements in the console dashboard
- 🔧 Developer experience improvements

### Medium Priority  
- ✨ New features for the dashboard
- 🧪 Test coverage improvements
- 🚀 Performance optimizations
- 🌐 Accessibility improvements

### Ideas Welcome
- 📱 Mobile responsiveness
- 🎨 Design system enhancements
- 🔌 New integrations
- 📊 Analytics and monitoring features

## 💡 Getting Help

- **Discord**: Join our community Discord server
- **GitHub Discussions**: Use GitHub Discussions for questions
- **Issues**: Create an issue for bug reports or feature requests
- **Documentation**: Check our docs at the docs site

## 📋 Code of Conduct

Please read and follow our [Code of Conduct](./CODE_OF_CONDUCT.md) to ensure a welcoming environment for all contributors.

## 📄 License

By contributing to Nuvix, you agree that your contributions will be licensed under the BSD-3-Clause License.

---

Thank you for helping make Nuvix better! 🚀
