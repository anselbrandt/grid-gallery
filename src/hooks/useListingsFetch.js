import { useEffect, useState } from "react";

export default function useListings(subreddit, token, sortBy, topSort, cursor) {
  const [fetchedListings, setFetchedListings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [next, setNext] = useState(null);

  useEffect(() => {
    setFetchedListings([]);
  }, [subreddit, sortBy, topSort]);

  useEffect(() => {
    setNext(null);
    const searchParams = new URLSearchParams([
      ["t", topSort],
      ["g", "GLOBAL"],
      ["after", cursor],
      ["count", 0],
      ["include_categories", false],
      ["limit", 25]
    ]);

    const controller = new AbortController();
    if (subreddit) {
      setIsLoading(true);
      fetch(
        `https://oauth.reddit.com/r/${subreddit}/${sortBy}/?${searchParams}`,
        {
          method: "GET",
          headers: {
            Authorization: `bearer ${token}`
          },
          signal: controller.signal
        }
      )
        .then(response => response.json())
        .then(response => {
          const newfetchedListings = response.data.children
            .filter(post => {
              return post.data.preview;
            })
            .filter(post => {
              const previews = post.data.preview.images[0].resolutions;
              return previews.length > 0;
            })
            .map(post => {
              const postUrl = post.data.url.replace(/amp;/g, "");
              const title = post.data.title
                .replace(/\[.*?\]/g, "")
                .replace(/\(.*?\)/g, "")
                .replace(/\{.*?\}/g, "")
                .replace(/amp;/g, "")
                .trim();
              const permalink = `https://www.reddit.com${post.data.permalink}`;
              const route = post.data.permalink;
              const sourceWidth = post.data.preview.images[0].source.width;
              const previews = post.data.preview.images[0].resolutions;
              const bestPreview = Math.min(previews.length - 1, 3);
              const preview =
                sourceWidth < 960
                  ? post.data.preview.images[0].source.url.replace(/amp;/g, "")
                  : post.data.preview.images[0].resolutions[
                      bestPreview
                    ].url.replace(/amp;/g, "");
              let fullsize;
              const maxPreview = previews[previews.length - 1].width;
              if (maxPreview > 1000) {
                fullsize = previews[previews.length - 1].url.replace(
                  /amp;/g,
                  ""
                );
              } else {
                fullsize = post.data.preview.images[0].source.url.replace(
                  /amp;/g,
                  ""
                );
              }
              return {
                key: post.data.id,
                image: postUrl,
                title: title,
                comments: post.data.num_comments,
                preview: preview,
                fullsize: fullsize,
                permalink: permalink,
                route: route,
                type: post.data.post_hint
              };
            });
          setFetchedListings(prevFetchedListings => {
            return [...prevFetchedListings, ...newfetchedListings];
          });
          setNext(response.data.after);
          setIsLoading(false);
        })
        .catch(error => {
          if (error.name === "AbortError") return;
          else throw error;
        });
    }
    return () => {
      setIsLoading(false);
      return controller.abort();
    };
  }, [subreddit, token, sortBy, topSort, cursor]);
  return { fetchedListings, isLoading, next };
}
