/**
 * error in this page needs to be done
 *
 */

"use client";
import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
const Page = ({ userid }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const myParams = useParams();

  function handleUserRating() {
    fetch("http://localhost:3000/api/giverating", {
      method: "POST",
      body: JSON.stringify({
        workerRating: rating,
        workerid: myParams.userid,
      }),
    });
  }

  return (
    <div>
      <div className="star-rating">
        {[...Array(5)].map((star, index) => {
          index += 1;
          return (
            <button
              type="button"
              key={index}
              className={index <= (hover || rating) ? "on" : "off"}
              onClick={() => setRating(index)}
              onMouseEnter={() => setHover(index)}
              onMouseLeave={() => setHover(rating)}
            >
              <span className="star">&#9733;</span>
            </button>
          );
        })}
      </div>
      {rating}
      page{userid}
      <button
        onClick={() => {
          /**
           * error is here
           */

          handleUserRating();
        }}
      >
        click me to submit
      </button>
    </div>
  );
};

export default Page;
