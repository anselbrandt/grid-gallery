import { useEffect, useState } from 'react';

export default function useAutocomplete(searchTerm, token) {
  const [autocompleteList, setAutocompleteList] = useState([]);

  useEffect(() => {
    setAutocompleteList([]);
  }, [searchTerm]);

  useEffect(() => {
    const searchParams = new URLSearchParams([
      ['include_categories', 'false'],
      ['include_over_18', 'true'],
      ['include_profiles', 'false'],
      ['limit', 10],
      ['query', searchTerm],
    ]);

    if (searchTerm) {
      const controller = new AbortController();
      fetch(
        `https://oauth.reddit.com/api/subreddit_autocomplete_v2?${searchParams}`,
        {
          method: 'GET',
          headers: {
            Authorization: `bearer ${token}`,
          },
          signal: controller.signal,
        },
      )
        .then((response) => response.json())
        .then((response) => {
          const nonPrivate = response.data.children.filter(
            (child) => child.data.subreddit_type !== 'private',
          );
          const subreddits = nonPrivate.map((child) => {
            return {
              key: child.data.id,
              name: child.data.display_name.toLowerCase(),
            };
          });
          setAutocompleteList(subreddits);
        })
        .catch((error) => {
          if (error.name === 'AbortError') return;
          else throw error;
        });
      return () => controller.abort();
    }
  }, [searchTerm, token]);
  return { autocompleteList };
}
