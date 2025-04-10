interface QueryResponse {
  answer: string;
}

// Environment variables
const DOC_QA_API_URL = import.meta.env.VITE_DOC_QA_API_URL;
const DOC_UPLOAD_API_URL = import.meta.env.VITE_DOC_UPLOAD_API_URL;

export const queryFlaskAPI = async (question: string): Promise<string | undefined> => {
  try {
    const response = await fetch(`${DOC_QA_API_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ question })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        typeof errorData?.message === "string" ? errorData.message : response.statusText;
      throw new Error(errorMessage);
    }

    const data = (await response.json()) as QueryResponse;
    return data.answer;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Fetch error:", error.message);
      return error.message;
    }
    console.error("An unexpected error occurred.");
    return "An unexpected error occurred.";
  }
};

export const uploadDocumentToAPI = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(`${DOC_UPLOAD_API_URL}`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        typeof errorData?.message === "string" ? errorData.message : response.statusText;
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data.message || "Uploaded successfully";
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Upload error:", error.message);
      return error.message;
    }
    return "An unexpected error occurred during upload.";
  }
};
