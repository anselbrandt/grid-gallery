import React from "react";

export default function Autocomplete(props) {
  return (
    <datalist id="subreddits">
      {props.autocompleteList.map(entry => (
        <option key={entry.key} value={entry.name} />
      ))}
    </datalist>
  );
}
