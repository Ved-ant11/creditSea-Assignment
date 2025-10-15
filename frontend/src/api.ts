import type { PaginatedResponse, Report } from "./types";

const API_BASE = `${import.meta.env.VITE_API_BASE_URL ?? ""}/api`;

export const fetchReports = async (
  signal?: AbortSignal
): Promise<PaginatedResponse> => {
  const response = await fetch(`${API_BASE}/reports?limit=5`, { signal });

  if (!response.ok) {
    throw new Error("Unable to load reports");
  }

  return response.json();
};

export const uploadXml = async (file: File): Promise<Report> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE}/reports/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const payload = await response
      .json()
      .catch(() => ({ message: "Upload failed" }));
    throw new Error(payload.message || "Upload failed");
  }

  return response.json();
};
