import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

interface Media {
  id: number;
  url: string;
  type: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface GetMediaParams {
    page?: number;
    limit?: number;
    type?: string;
    search?: string;
}

interface MediaResponse {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    items: Media[];
}

const fetchMedia = async ({ page = 1, limit = 10, type, search }: GetMediaParams): Promise<MediaResponse> => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  if (type) params.append('type', type);
  if (search) params.append('search', search);

  const response = await api.get<MediaResponse>(`/api/media`, { params });
  return response.data;
};

export const useGetMedia = (params: GetMediaParams) => {
  return useQuery<MediaResponse, Error>({
    queryKey: ['media', params],
    queryFn: () => fetchMedia(params),
  });
};
