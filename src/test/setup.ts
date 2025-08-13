import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock environment variables
vi.mock("import.meta.env", () => ({
  VITE_API_BASE_URL: "http://localhost:3000",
  VITE_API_KEY: "test-api-key",
}));

// Mock fetch globally
global.fetch = vi.fn();

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
