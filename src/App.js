import React, { useEffect, useState, createRef } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "./App.css";

import SearchInput from "./components/SearchInput";
import Autocomplete from "./components/Autocomplete";
import SortSelector from "./components/SortSelector";
import TopSortSelector from "./components/TopSortSelector";
import LayoutSelector from "./components/LayoutSelector";
import Listings from "./components/Listings";
import Footer from "./components/Footer";
import Loading from "./components/Loading";
import Post from "./components/Post";

import useTokenFetch from "./hooks/useTokenFetch";
import useAutocomplete from "./hooks/useAutocomplete";
import useListingsFetch from "./hooks/useListingsFetch";
import usePostFetch from "./hooks/usePostFetch";

function App() {
  const [searchTerm, setSearchTerm] = useState();
  const [sortBy, setSortBy] = useState("hot");
  const [topSort, setTopSort] = useState(null);
  const [subreddit, setSubreddit] = useState();
  const [displayedListings, setDisplayedListings] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [bottom, setBottom] = useState(null);
  const [postID, setPostID] = useState();
  const [preferredLayout, setPreferredLayout] = useState("Gallery");

  const { token } = useTokenFetch();
  const { autocompleteList } = useAutocomplete(searchTerm, token);
  const { fetchedListings, isLoading, next } = useListingsFetch(
    subreddit,
    token,
    sortBy,
    topSort,
    cursor
  );
  const { fetchedPost, fetchedComments, isPostLoading } = usePostFetch(
    subreddit,
    postID,
    searchTerm,
    token
  );

  useEffect(() => {
    const names = autocompleteList.map(entry => entry.name.toLowerCase());
    if (names.includes(searchTerm)) {
      setSubreddit(searchTerm);
    } else {
      setDisplayedListings([]);
    }
  }, [autocompleteList, searchTerm]);

  useEffect(() => {
    setDisplayedListings(fetchedListings);
  }, [fetchedListings]);

  const handleSearch = event => {
    const value = event.currentTarget.value;
    setSearchTerm(value);
    setSubreddit();
    setCursor(null);
    setPostID();
    window.scrollTo(0, 0);
  };

  const handleSort = event => {
    const id = event.target.selectedIndex;
    setSortBy(event.target[id].value);
    setCursor(null);
    window.scrollTo(0, 0);
    if (event.target[id].value === "top") {
      setTopSort("all");
    }
  };
  const handleTopSort = event => {
    const id = event.target.selectedIndex;
    setTopSort(event.target[id].value);
    setCursor(null);
    window.scrollTo(0, 0);
  };

  const handleLayout = event => {
    const id = event.target.selectedIndex;
    setPreferredLayout(event.target[id].value);
    window.scrollTo(0, 0);
  };

  const bottomObserver = createRef(null);
  useEffect(() => {
    if (isLoading) return;
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setCursor(next);
      }
    });
    bottomObserver.current = observer;
  }, [next, isLoading, bottomObserver]);

  useEffect(() => {
    if (isLoading) return;
    const observer = bottomObserver.current;
    if (bottom) {
      observer.observe(bottom);
    }
    return () => {
      if (bottom) {
        observer.unobserve(bottom);
      }
    };
  }, [bottom, isLoading, bottomObserver]);

  const handlePost = value => {
    setPostID(value);
  };

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <div className="App-body">
            <div className="App-header">
              <div className="Header">
                <span>
                  <SearchInput handleSearch={handleSearch} />
                  <Autocomplete autocompleteList={autocompleteList} />
                  <SortSelector handleSort={handleSort} defaultValue={sortBy} />
                  {sortBy === "top" && (
                    <TopSortSelector
                      handleTopSort={handleTopSort}
                      defaultValue={topSort}
                    />
                  )}
                  <LayoutSelector
                    preferredLayout={preferredLayout}
                    handleLayout={handleLayout}
                  />
                </span>
              </div>
            </div>
            <Listings
              displayedListings={displayedListings}
              ref={setBottom}
              postData={fetchedPost}
              commentsData={fetchedComments}
              handlePost={handlePost}
              preferredLayout={preferredLayout}
            />
            {isLoading ? (
              <Loading />
            ) : (
              displayedListings.length === 0 && <Footer />
            )}
          </div>
        </Route>
        {fetchedListings.map(post => (
          <Route
            key={post.key}
            path={post.route}
            render={props => (
              <Post
                {...props}
                postData={fetchedPost}
                commentsData={fetchedComments}
                isLoading={isPostLoading}
              />
            )}
          />
        ))}
      </Switch>
    </BrowserRouter>
  );
}

export default App;
