import React, { useState } from "react";
import toast from "react-hot-toast";

const ContactUs = () => {
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContactForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit =async (e) => {
    e.preventDefault();
    //verify email with regex
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(contactForm.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }


    //make them to the form
    const formData = new FormData();
    formData.append("name", contactForm.name);
    formData.append("email", contactForm.email);
    formData.append("message", contactForm.message);
    formData.append("subject"   , "Contact Form Submission");
    formData.append("access_key", "be099342-30ff-48b3-8f18-f24d1b0fc80f")

    

    setLoading(true);
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      toast.success("Message sent successfully");

      //reset form
      setContactForm({
        name: "",
        email: "",
        message: "",
      });


    } else {
      console.log("Error", data);
      toast.error("An error occurred. Please try again later.");
    }

    setLoading(false);

  };

  return (
    <section id="contact-us">
      <div className="container">
        <h1 className="title">
          <span>Contact</span> Us
        </h1>
        <p className="description">
          Have questions or need assistance? Fill out the form below and we’ll
          get back to you shortly.
        </p>
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={contactForm.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={contactForm.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <textarea
              name="message"
              placeholder="Your Message"
              rows="6"
              value={contactForm.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <button disabled={loading} type="submit" className="submit-btn">
            {loading ? "Sending..." : "Send Message"} 
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactUs;
