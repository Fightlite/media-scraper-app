import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';

interface ScrapeUrlsResponse {
  message: string;
  scrapedUrls: string[];
}

export const useScrapeUrls = () => {
  const queryClient = useQueryClient();

  return useMutation<ScrapeUrlsResponse, Error, string[]>({
    mutationFn: async (urls: string[]) => {
      const response = await api.post<ScrapeUrlsResponse>(
        `/api/scrape`,
        { urls },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch any queries that depend on the media data
      queryClient.invalidateQueries({ queryKey: ['media'] });
    },
  });
};
