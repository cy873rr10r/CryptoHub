import React from "react";
import "./ContactUs.css";

const ContactUs = () => {
  return (
    <div className="contact-container">
      <div className="contact-header">
        <h1 className="contact-title">Contact Us</h1>
        <p className="contact-subtitle">
          Have a question, feedback, or partnership idea? Drop us a message and
          we will get back to you.
        </p>
      </div>
      <div className="contact-content">
        <form className="contact-form">
          <div className="form-group">
            <label>Your Name</label>
            <input type="text" placeholder="Enter your name" />
          </div>
          <div className="form-group">
            <label>Your Email</label>
            <input type="email" placeholder="Enter your email" />
          </div>
          <div className="form-group">
            <label>Your Message</label>
            <textarea rows="5" placeholder="Enter your message"></textarea>
          </div>
          <button className="button" type="submit">
            Send Message
          </button>
        </form>
        <div className="contact-info">
          <h3>Reach Us</h3>
          <p>Email : support@cryptohub.com</p>
          <p>Location: India, Remote Team</p>
          <p>Support Hours: 24/7</p>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
