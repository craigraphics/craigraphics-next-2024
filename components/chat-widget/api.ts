// Fetch suggestions function
export const fetchSuggestions = async (locale: string) => {
  const response = await fetch(`/api/chat/suggestions?locale=${locale}`);
  if (!response.ok) {
    throw new Error('Failed to fetch suggestions');
  }
  const data = await response.json();
  return data.suggestions;
};
