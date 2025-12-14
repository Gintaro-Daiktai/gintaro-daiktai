const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export const fetchImageBlob = async (imageId: number): Promise<string> => {
  const res = await fetch(`${API_BASE_URL}/api/images/${imageId}`);
  if (!res.ok) throw new Error("Failed to fetch image");
  const blob = await res.blob();
  return URL.createObjectURL(blob);
};
