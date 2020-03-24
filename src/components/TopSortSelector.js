import React from 'react';

export default function SortResults(props) {
  return (
    <select defaultValue={props.topSort} onChange={props.handleTopSort}>
      <option value="all">All-time</option>
      <option value="year">Year</option>
      <option value="month">Month</option>
      <option value="week">Week</option>
    </select>
  );
}
