import React from "react";

function Contact() {
  return (
    <div className="contact">
      <div class="container">
        <div class="row align-items-center my-5">
          <div class="col-lg-7">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2373.576734623613!2d20.39108762918977!3d45.381766711978884!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x475adb5311c99e17%3A0x2e3d919497146bf9!2sCentral%20Perk!5e0!3m2!1ssr!2srs!4v1612138778728!5m2!1ssr!2srs"
             width="600" height="450" frameborder="0" allowfullscreen="" aria-hidden="false" tabindex="0">
            </iframe>
          </div>
          <div class="col-lg-5">
            <h1 class="font-weight-light">Contact</h1>
            <p>
                Small Cafe<br/>
                Street and Number<br/>
                City and Postal address
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
