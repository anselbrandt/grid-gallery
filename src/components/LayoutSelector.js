import React from 'react';

export default function LayoutSelector(props) {
  return (
    <select defaultValue={props.preferredLayout} onChange={props.handleLayout}>
      <option value="Gallery">Grid</option>
      <option value="Gallery-single-column">Column</option>
    </select>
  );
}
