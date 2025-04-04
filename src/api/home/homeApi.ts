import { apiClient } from "../instance/client";

export const getBestReview = async () => {
  const response = await apiClient.get("/home/best-review");
  return response.data;
};
