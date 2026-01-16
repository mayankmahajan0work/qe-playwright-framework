# QE Playwright Automation Framework – Salesforce Lightning

## Overview
This repository demonstrates a scalable Playwright-based UI automation framework
designed for complex enterprise web applications, using Salesforce Lightning
as the reference application.

The focus of this project is framework design, maintainability, and
real-world Quality Engineering practices rather than broad test coverage.

## Tech Stack
- Playwright (TypeScript)
- Node.js
- Page Object Model (POM)

## Framework Design Principles
- Clear separation of test logic and page interactions
- Reusable page objects and utilities
- Stable locator strategy suitable for dynamic Lightning components
- Minimal but representative test coverage
- Fast feedback and CI/CD readiness

## Test Coverage
- Salesforce Login flow
- Core business flow (Opportunity creation/update)

## Locator Strategy
Salesforce Lightning presents unique automation challenges due to dynamic DOM rendering.
This framework prioritizes:
1. Role-based locators (`getByRole`)
2. Stable attributes where available
3. Resilient text-based selectors
4. Avoidance of brittle absolute locators

## Authentication Strategy
Login is handled using Playwright storage state to:
- Reduce test execution time
- Improve stability
- Avoid repeated UI logins

## Scalability Considerations
This framework is designed to support:
- Parallel execution
- Environment-based configuration
- CI/CD integration
- Team-based test ownership

## What This Project Demonstrates
- Enterprise-grade UI automation design
- Handling of complex, asynchronous UIs
- Pragmatic test scoping decisions
- Leadership-level Quality Engineering thinking

## Future Enhancements (Intentionally Out of Scope)
- Full regression coverage
- Cross-browser execution
- Visual testing
- Salesforce API-based test data setup