import React from 'react';
import moment from 'moment';
import "./NewsItems.css";
import { useState } from 'react';


export default function NewsItems(props) {
  const [showComment, setShowComment] = useState(false);

  const dateFormat = (time) => {
    const resultDate = moment(time.slice(0, 19) + "Z").format("dddd, MMMM Do YYYY, h:mm:ss a")
    return resultDate;
  }

  const hideShowComment = () => {
    setShowComment(!showComment);
  }

  return (
    <div className={`card shadow card-${props.mode} bg-${props.mode} h-100`} style={{ width: "90%" }}>
      <span className="position-absolute shadow badge rounded bg-danger p-1 m-1" style={{ right: 0 }}>
        {props.author}
      </span>
      <div className="card-body mt-3">
        <h5 className="card-title">{props.title}</h5>
        {
          showComment ? <p class="card-text" style={{ height: 200, overflowY: "scroll" }}>
            {
              props.comment
            }
          </p> : <p></p>
        }
        <p className="text-secondary">{dateFormat(props.time)}</p>
        <button className="btn btn-secondary btn-sm shadow" onClick={hideShowComment} style={{marginRight:10}}>
          {
            showComment ? "Hide Comment" : "Show Comment"
          }
        </button>
        <a href={props.url} className="btn btn-primary btn-sm shadow">
          Read More
        </a>
      </div>
    </div>
  );
}
