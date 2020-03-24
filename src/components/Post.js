import React from "react";
import Markdown from "react-markdown";

export default function Post(props) {
  return (
    <div className="Post-container">
      <div className="Post-body">
        <div className="Post">
          <div className="Post-header">
            <div className="Post-image">
              <a
                href={props.postData.image}
                target={"_blank"}
                rel={"noopener noreferrer"}
              >
                <img
                  src={props.postData.preview}
                  alt={props.postData.title}
                ></img>
              </a>
            </div>
            <div className="Post-caption">
              <div className="Post-title">
                <div>
                  <b>{props.postData.title}</b>
                </div>
              </div>
              <div className="Post-author">
                <a href={props.postData.profile}>
                  <b>{props.postData.author}</b>
                </a>
              </div>
              <div className="Post-link">
                {props.isLoading ? (
                  "Loading..."
                ) : (
                  <a href={props.postData.permalink}>(reddit)</a>
                )}
              </div>
            </div>
          </div>
          <div className="Comments">
            {props.commentsData.map(comment => (
              <div key={comment.id} className="Comment">
                <div>
                  <a href={comment.profile}>{comment.author}</a>
                </div>
                <div className="Comment-body">
                  <Markdown source={comment.body} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
