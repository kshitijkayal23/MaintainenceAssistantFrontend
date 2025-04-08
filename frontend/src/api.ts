import axios from "axios";

interface QueryResponse {
  answer: string;
}

export const queryFlaskAPI = async (question: string): Promise<string | undefined> => {
  try {
    const response = await axios.post<QueryResponse>(
      "http://localhost:8000/query",
      { question },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    return response.data.answer;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error message:", error.message);
      return error.message;
    } else {
      console.error("Unexpected error:", error);
      return "An unexpected error occurred.";
    }
  }
};
