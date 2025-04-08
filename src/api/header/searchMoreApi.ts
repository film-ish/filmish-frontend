import { apiClient } from "../instance/client";

const searchKeywordApi = async (keyword: string) => {
  const response = await apiClient.get(`/knockknock/keywords?data=${keyword}`);
  return response.data;
};

const searchMovieApi = async (keyword: string) => {
  const response = await apiClient.get(`/knockknock/movies?data=${keyword}`);
  return response.data;
};

const searchActorApi = async (keyword: string) => {
  const response = await apiClient.get(`/knockknock/actors?data=${keyword}`);
  return response.data;
};

const searchDirectorApi = async (keyword: string) => {
  const response = await apiClient.get(`/knockknock/directors?data=${keyword}`);
  return response.data;
};

const searchGenreApi = async (keyword: string) => {
  const response = await apiClient.get(`/knockknock/genres?data=${keyword}`);
  return response.data;
};

export { searchKeywordApi, searchMovieApi, searchActorApi, searchDirectorApi, searchGenreApi };









