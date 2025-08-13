export interface ApiClientError extends Error {
  status?: number;
  url?: string;
  options?: RequestInit;
  data?: any;
  originalError?: Error;
}

export interface RequestOptions extends Omit<RequestInit, "method" | "body"> {
  params?: Record<string, string | number | boolean>;
  timeout?: number;
}

export interface ApiClientOptions {
  baseURL?: string;
  apiKey?: string;
  timeout?: number;
  defaultHeaders?: Record<string, string>;
}
