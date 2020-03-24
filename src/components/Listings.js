import React, { forwardRef } from "react";
import { Link } from "react-router-dom";

const Listings = forwardRef((props, ref) => {
  const preferredLayout = props.preferredLayout;
  return (
    <div className="Gallery-container">
      <div className={preferredLayout}>
        {props.displayedListings.map((post, index) => {
          if (index === props.displayedListings.length - 1) {
            return (
              <article
                key={post.key}
                ref={ref}
                onClick={() => props.handlePost(post.key)}
              >
                <div className="Frame">
                  <Link to={post.route}>
                    {preferredLayout === "Gallery" && (
                      <div className="Content">
                        <div className="Text-wrapper">{post.title}</div>
                      </div>
                    )}
                    <img
                      src={
                        preferredLayout === "Gallery"
                          ? post.preview
                          : post.fullsize
                      }
                      alt={post.title}
                    />
                  </Link>
                </div>
                {preferredLayout === "Gallery-single-column" && (
                  <div className="Content">
                    <div className="Text-wrapper">
                      {post.title}{" "}
                      <Link to={post.route}>{post.comments} comments</Link>
                    </div>
                  </div>
                )}
              </article>
            );
          } else {
            return (
              <article
                key={post.key}
                onClick={() => props.handlePost(post.key)}
              >
                <div className="Frame">
                  <Link to={post.route}>
                    {preferredLayout === "Gallery" && (
                      <div className="Content">
                        <div className="Text-wrapper">{post.title}</div>
                      </div>
                    )}
                    <img
                      src={
                        preferredLayout === "Gallery"
                          ? post.preview
                          : post.fullsize
                      }
                      alt={post.title}
                    />
                  </Link>
                </div>
                {preferredLayout === "Gallery-single-column" && (
                  <div className="Content">
                    <div className="Text-wrapper">
                      {post.title}{" "}
                      <Link to={post.route}>{post.comments} comments</Link>
                    </div>
                  </div>
                )}
              </article>
            );
          }
        })}
      </div>
    </div>
  );
});

export default Listings;
