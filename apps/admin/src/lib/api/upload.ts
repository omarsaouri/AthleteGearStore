export async function uploadImage(file: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const { url } = await response.json();
    return url;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}
