import { useEffect, useState } from "react";

export default function usePostFetch(subreddit, postID, searchTerm, token) {
  const [fetchedPost, setFetchedPost] = useState([]);
  const [fetchedComments, setFetchedComments] = useState([]);
  const [isPostLoading, setIsPostLoading] = useState(true);

  useEffect(() => {
    setFetchedPost([]);
    setFetchedComments([]);
  }, [postID, subreddit, searchTerm]);

  useEffect(() => {
    setIsPostLoading(true);

    const searchParams = new URLSearchParams([
      ["article", postID],
      ["context", 8],
      ["showedits", false],
      ["showmore", false],
      ["sort", "top"],
      ["threaded", false],
      ["truncate", 50]
    ]);

    const controller = new AbortController();
    if (postID && subreddit) {
      fetch(
        `https://oauth.reddit.com/r/${subreddit}/comments/article/?${searchParams}`,
        {
          method: "Get",
          headers: {
            Authorization: `bearer ${token}`
          }
        }
      )
        .then(response => response.json())
        .then(response => {
          const article = response[0].data.children[0];
          const post = () => {
            const title = article.data.title
              .replace(/\[.*?\]/g, "")
              .replace(/\(.*?\)/g, "")
              .replace(/\{.*?\}/g, "")
              .replace(/amp;/g, "")
              .trim();
            const permalink = `https://www.reddit.com${article.data.permalink}`;
            const author = article.data.author;
            const comments = article.data.num_comments;
            const url = article.data.url;
            const thumbnail = article.data.thumbnail;
            const sourceWidth = article.data.preview.images[0].source.width;
            const previews = article.data.preview.images[0].resolutions;
            const bestPreview = Math.min(previews.length - 1, 3);
            const preview =
              sourceWidth < 960
                ? article.data.preview.images[0].source.url.replace(/amp;/g, "")
                : article.data.preview.images[0].resolutions[
                    bestPreview
                  ].url.replace(/amp;/g, "");
            return {
              title: title,
              permalink: permalink,
              author: author,
              profile: `https://www.reddit.com/user/${author}`,
              image: url,
              preview: preview,
              thumbnail: thumbnail,
              comments: comments
            };
          };
          const comments = response[1].data.children.map(comment => {
            const body = comment.data.body
              .replace(/&amp;#x200B;/g, "")
              .replace(/&amp;/g, "&")
              .replace(/&gt;/g, "")
              .replace(/&lt;/g, "")
              .replace(/&gte;/g, "")
              .replace(/&lte;/g, "");
            const id = comment.data.id;
            const author = comment.data.author;
            const profile = `https://www.reddit.com/user/${author}`;
            return {
              body: body,
              id: id,
              author: author,
              profile: profile
            };
          });
          setFetchedPost(post);
          setFetchedComments([...comments]);
          setIsPostLoading(false);
        })
        .catch(error => {
          if (error.name === "AbortError") return;
          else throw error;
        });
    }
    return () => controller.abort();
  }, [subreddit, postID, searchTerm, token]);
  return { fetchedPost, fetchedComments, isPostLoading };
}
