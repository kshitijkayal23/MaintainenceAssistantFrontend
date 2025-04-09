interface QueryResponse {
  answer: string;
}
 
export const queryFlaskAPI = async (question: string): Promise<string | undefined> => {
  try {
    const response = await fetch("http://localhost:5000/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ question })
    });
 
    // Check if the response status indicates a successful request.
    if (!response.ok) {
      // Try to extract error details from the response.
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        (typeof errorData?.message === "string" ? errorData.message : response.statusText) ||
        "Unknown error occurred";
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