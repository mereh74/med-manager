import type {
  ApiClientError,
  ApiClientOptions,
  RequestOptions,
} from "../../types/client";
import { snakeToCamelCase } from "../../utils/caseTransform";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://rbn1g3hpv0.execute-api.us-east-1.amazonaws.com/Prod";
const API_KEY = import.meta.env.VITE_API_KEY;
const TIMEOUT = 10000;

// Helper function to create timeout promise
const createTimeoutPromise = (timeout: number): Promise<never> => {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error("Request timeout")), timeout);
  });
};

// Helper function to handle fetch errors
const handleFetchError = async (
  response: Response,
  url: string,
  options: RequestInit
): Promise<never> => {
  const error = new Error(
    `HTTP ${response.status}: ${response.statusText}`
  ) as ApiClientError;
  error.status = response.status;
  error.url = url;
  error.options = options;

  // Try to get error details from response body
  try {
    const errorData = await response.json();
    error.data = errorData;
  } catch {
    // Response might not be JSON
    error.data = { message: response.statusText };
  }

  // Handle common error scenarios
  if (response.status === 401) {
    // Unauthorized - redirect to login
    localStorage.removeItem("authToken");
    window.location.href = "/login";
  }

  if (response.status === 403) {
    // Forbidden - show error message
    console.error("Access denied");
  }

  // Log errors in development
  if (import.meta.env.DEV) {
    console.error("API Error:", error);
  }

  throw error;
};

// Main API client class
class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(options: ApiClientOptions = {}) {
    this.baseURL = options.baseURL || BASE_URL;
    this.defaultHeaders = {
      "Content-Type": "application/json",
      ...options.defaultHeaders,
    };

    // Add API key if available
    const apiKey = options.apiKey || API_KEY;
    if (apiKey) {
      this.defaultHeaders["X-API-Key"] = apiKey;
    }
  }

  // Build full URL
  private buildUrl(
    endpoint: string,
    params: Record<string, string | number | boolean> = {}
  ): string {
    const url = new URL(
      endpoint.startsWith("http") ? endpoint : `${this.baseURL}${endpoint}`
    );

    // Add query parameters
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, String(params[key]));
      }
    });

    return url.toString();
  }

  // Build headers
  private buildHeaders(
    customHeaders: Record<string, string> = {}
  ): Record<string, string> {
    const headers = { ...this.defaultHeaders, ...customHeaders };

    // Add auth token if available
    const token = localStorage.getItem("authToken");
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  // Generic request method
  async request(
    endpoint: string,
    options: RequestOptions & { method?: string; body?: unknown } = {}
  ): Promise<Response> {
    const {
      method = "GET",
      body,
      headers = {},
      params = {},
      timeout = TIMEOUT,
      ...fetchOptions
    } = options;

    const url = this.buildUrl(endpoint, method === "GET" ? params : {});
    const requestHeaders = this.buildHeaders(
      headers instanceof Array
        ? Object.fromEntries(headers)
        : (headers as Record<string, string>)
    );

    // Prepare request options
    const requestOptions: RequestInit = {
      method,
      headers: requestHeaders,
      ...fetchOptions,
    };

    // Add body for non-GET requests
    if (body && method !== "GET") {
      if (body instanceof FormData) {
        // Remove Content-Type header for FormData (browser will set it with boundary)
        if (Array.isArray(requestOptions.headers)) {
          requestOptions.headers = requestOptions.headers.filter(
            ([key]) => key !== "Content-Type"
          );
        } else if (
          requestOptions.headers &&
          typeof requestOptions.headers === "object"
        ) {
          delete (requestOptions.headers as Record<string, string>)[
            "Content-Type"
          ];
        }
        requestOptions.body = body;
      } else {
        requestOptions.body = JSON.stringify(body);
      }
    }

    // Log requests in development
    if (import.meta.env.DEV) {
      console.log(`🚀 ${method} ${url}`, requestOptions);
    }

    try {
      // Race between fetch and timeout
      const response = await Promise.race([
        fetch(url, requestOptions),
        createTimeoutPromise(timeout),
      ]);

      // Handle non-ok responses
      if (!response.ok) {
        await handleFetchError(response, url, requestOptions);
      }

      // Create a modified response with transformed JSON
      const originalJson = response.json.bind(response);
      const modifiedResponse = {
        ...response,
        json: async () => {
          const data = await originalJson();
          return snakeToCamelCase(data);
        },
      };

      return modifiedResponse;
    } catch (error) {
      // Re-throw with additional context if it's not already our custom error
      if (!(error as ApiClientError).status) {
        const enhancedError = new Error(
          `Network error: ${(error as Error).message}`
        ) as ApiClientError;
        enhancedError.originalError = error as Error;
        enhancedError.url = url;
        enhancedError.options = requestOptions;
        throw enhancedError;
      }
      throw error;
    }
  }

  // GET request
  async get(endpoint: string, options: RequestOptions = {}): Promise<Response> {
    const { params, ...restOptions } = options;
    return this.request(endpoint, {
      method: "GET",
      params,
      ...restOptions,
    });
  }

  // POST request
  async post(
    endpoint: string,
    body?: unknown,
    options: RequestOptions = {}
  ): Promise<Response> {
    return this.request(endpoint, {
      method: "POST",
      body,
      ...options,
    });
  }

  // PUT request
  async put(
    endpoint: string,
    body?: any,
    options: RequestOptions = {}
  ): Promise<Response> {
    return this.request(endpoint, {
      method: "PUT",
      body,
      ...options,
    });
  }

  // PATCH request
  async patch(
    endpoint: string,
    body?: any,
    options: RequestOptions = {}
  ): Promise<Response> {
    return this.request(endpoint, {
      method: "PATCH",
      body,
      ...options,
    });
  }

  // DELETE request
  async delete(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<Response> {
    return this.request(endpoint, {
      method: "DELETE",
      ...options,
    });
  }
}

// Create and export the API client instance
export const apiClient = new ApiClient();
