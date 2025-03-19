# MindVault Scripts

This directory contains utility scripts for the MindVault monorepo.

## Test Scripts

### `run-tests.sh`

A utility script for running tests across the entire monorepo with nice formatting.

#### Usage

You can run this script directly:

```bash
# Run all tests
./scripts/run-tests.sh

# Run tests with coverage
./scripts/run-tests.sh --coverage

# Run tests in watch mode
./scripts/run-tests.sh --watch
```

Or use the npm scripts defined in the root package.json:

```bash
# Run all tests
pnpm test:all

# Run tests with coverage
pnpm test:all:coverage

# Run tests in watch mode
pnpm test:all:watch
```

## Individual Package Testing

You can also run tests for individual packages:

```bash
# Run tests for a specific package
pnpm --filter @mindvault/web test

# Run tests in watch mode for a specific package
pnpm --filter @mindvault/web test:watch

# Run tests with coverage for a specific package
pnpm --filter @mindvault/web test -- --coverage
``` 