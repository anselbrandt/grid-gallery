import React from 'react';

export default function Footer() {
  return (
    <div className="App-footer">
      <div className="Footer">
        <div>
          <h2>Browse images from any subreddit</h2>
        </div>
        <div>
          Try <code>cabinporn</code> if you can't think of anything.
        </div>
        <br></br>
        <div>
          <p>
            View the code on{' '}
            <a href="https://github.com/anselbrandt/reddit-image-browser">
              GitHub
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
