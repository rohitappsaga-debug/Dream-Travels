// Central place to configure API base URL for the backend.
// Uses REACT_APP_API_BASE_URL when set, otherwise falls back to localhost:8000.

export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

