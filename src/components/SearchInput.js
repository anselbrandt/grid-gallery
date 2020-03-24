import React from 'react';

export default function SearchInput(props) {
  return (
    <input
      list="subreddits"
      type="text"
      placeholder="search"
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck="false"
      onChange={props.handleSearch}
    ></input>
  );
}
