#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Running tests for MindVault Monorepo ===${NC}"
echo -e "${YELLOW}Starting tests...${NC}"

# Run tests using turbo
if [ "$1" == "--coverage" ]; then
  echo -e "${YELLOW}Running tests with coverage...${NC}"
  pnpm turbo run test -- --coverage
elif [ "$1" == "--watch" ]; then
  echo -e "${YELLOW}Running tests in watch mode...${NC}"
  pnpm turbo run test:watch
else
  echo -e "${YELLOW}Running all tests...${NC}"
  pnpm turbo run test
fi

# Check the exit code
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓ All tests passed!${NC}"
  exit 0
else
  echo -e "${RED}✗ Some tests failed!${NC}"
  exit 1
fi 