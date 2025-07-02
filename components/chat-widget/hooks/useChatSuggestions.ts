import { useQuery } from '@tanstack/react-query';
import { useLocale } from 'next-intl';
import { fetchSuggestions } from '../api';

export const useChatSuggestions = (isOpen: boolean) => {
  const locale = useLocale();

  return useQuery({
    queryKey: ['chat-suggestions', locale],
    queryFn: () => fetchSuggestions(locale),
    enabled: isOpen, // Only fetch when chat is open
    staleTime: 5 * 60 * 1000, // Data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });
};
