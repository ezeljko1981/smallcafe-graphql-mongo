import React from "react";
import about from './../images/about.png';

function About() {
  return (
    <div className="about">
      <div class="container">
        <div class="row align-items-center my-5">
          <div class="col-lg-7">
            <img
              alt="about" src={about}
              class="img-fluid rounded mb-4 mb-lg-0"
            />
          </div>
          <div class="col-lg-5">
            <h1 class="font-weight-light">About</h1>
            <p>
              We have been serving coffee since 2000.<br/>
              Our customers are our best reccomendations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
