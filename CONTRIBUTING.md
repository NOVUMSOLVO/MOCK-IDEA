# 🤝 Contributing to MOCK IDEA

Thank you for your interest in contributing to MOCK IDEA! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Guidelines](#development-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Community](#community)

## 📜 Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before contributing.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 13+
- Redis 6+
- Git
- Basic knowledge of TypeScript, React, and Node.js

### Development Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/yourusername/mock-idea.git
   cd mock-idea
   ```
3. **Follow the setup instructions** in the [README.md](README.md)
4. **Create a new branch** for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 🛠️ How to Contribute

### Types of Contributions

We welcome various types of contributions:

- 🐛 **Bug Reports**: Help us identify and fix issues
- 💡 **Feature Requests**: Suggest new features or improvements
- 📝 **Documentation**: Improve our documentation
- 🧪 **Testing**: Add or improve test coverage
- 🎨 **UI/UX**: Enhance user interface and experience
- 🔧 **Code**: Fix bugs or implement new features

### What We're Looking For

**High Priority:**
- Bug fixes and security improvements
- Performance optimizations
- Test coverage improvements
- Documentation enhancements
- Accessibility improvements

**Medium Priority:**
- New template categories
- UI/UX improvements
- Integration with new services
- Developer experience improvements

**Please Note:**
- Core business logic and AI algorithms are proprietary
- Major architectural changes require prior discussion
- Commercial features require separate licensing

## 💻 Development Guidelines

### Code Style

- **TypeScript**: Use TypeScript for all new code
- **ESLint**: Follow the existing ESLint configuration
- **Prettier**: Use Prettier for code formatting
- **Naming**: Use descriptive variable and function names
- **Comments**: Add comments for complex logic

### Commit Messages

Use conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(templates): add new business card template category
fix(auth): resolve JWT token expiration issue
docs(api): update authentication endpoint documentation
```

### Testing

- **Unit Tests**: Write unit tests for new functions
- **Integration Tests**: Add integration tests for API endpoints
- **E2E Tests**: Include end-to-end tests for critical user flows
- **Test Coverage**: Maintain minimum 80% test coverage

### Documentation

- **Code Comments**: Document complex algorithms and business logic
- **API Documentation**: Update API docs for new endpoints
- **README Updates**: Update setup instructions if needed
- **Changelog**: Add entries to CHANGELOG.md

## 🔄 Pull Request Process

### Before Submitting

1. **Test your changes** thoroughly
2. **Run the test suite** and ensure all tests pass
3. **Update documentation** if necessary
4. **Check code style** with ESLint and Prettier
5. **Rebase your branch** on the latest main branch

### Submitting a Pull Request

1. **Push your branch** to your fork
2. **Create a pull request** from your branch to `main`
3. **Fill out the PR template** completely
4. **Link related issues** using keywords (fixes #123)
5. **Request review** from maintainers

### PR Requirements

- ✅ All tests pass
- ✅ Code follows style guidelines
- ✅ Documentation is updated
- ✅ No merge conflicts
- ✅ Descriptive title and description
- ✅ Linked to relevant issues

### Review Process

1. **Automated Checks**: CI/CD pipeline runs automatically
2. **Code Review**: Maintainers review your code
3. **Feedback**: Address any requested changes
4. **Approval**: Once approved, your PR will be merged

## 🐛 Issue Reporting

### Bug Reports

When reporting bugs, please include:

- **Description**: Clear description of the issue
- **Steps to Reproduce**: Detailed steps to reproduce the bug
- **Expected Behavior**: What you expected to happen
- **Actual Behavior**: What actually happened
- **Environment**: OS, browser, Node.js version, etc.
- **Screenshots**: If applicable

### Feature Requests

For feature requests, please include:

- **Problem Statement**: What problem does this solve?
- **Proposed Solution**: Your suggested approach
- **Alternatives**: Other solutions you've considered
- **Use Cases**: How would this feature be used?
- **Priority**: How important is this feature?

## 🌟 Recognition

Contributors will be recognized in:

- **Contributors List**: Added to our contributors page
- **Release Notes**: Mentioned in release notes
- **Social Media**: Highlighted on our social channels
- **Swag**: Eligible for MOCK IDEA merchandise

## 📞 Community

### Getting Help

- **GitHub Discussions**: For questions and general discussion
- **Discord**: Join our community Discord server
- **Email**: Contact us at contributors@mockidea.com

### Communication Guidelines

- **Be Respectful**: Treat everyone with respect and kindness
- **Be Patient**: Maintainers are volunteers with limited time
- **Be Clear**: Provide clear and detailed information
- **Be Constructive**: Focus on solutions, not just problems

## 🚫 What We Don't Accept

- **Spam or promotional content**
- **Offensive or inappropriate content**
- **Copyright violations**
- **Malicious code or security vulnerabilities**
- **Changes to core proprietary algorithms**
- **Unauthorized commercial use**

## 📄 License

By contributing to MOCK IDEA, you agree that your contributions will be licensed under the same license as the project. See [LICENSE](LICENSE) for details.

---

**Questions?** Feel free to reach out to us at contributors@mockidea.com

Thank you for contributing to MOCK IDEA! 🎉
