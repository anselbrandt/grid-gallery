import React from 'react';

export default function SortResults(props) {
  return (
    <select defaultValue={props.sortBy} onChange={props.handleSort}>
      <option value="hot">Hot</option>
      <option value="new">New</option>
      <option value="rising">Rising</option>
      <option value="top">Top</option>
    </select>
  );
}
