import React, { useState } from "react";

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq">
      <div className="container">
        <h1 className="title">
          <span>Frequently</span> Asked Questions
        </h1>
        <p className="description">
          Find answers to some of the most commonly asked questions below. If
          you have any other queries, feel free to contact us.
        </p>
        <div className="faq-list">
          {FAQList.map((faq, index) => (
            <div
              className={`faq-item ${activeIndex === index ? "active" : ""}`}
              key={index}
              onClick={() => toggleFAQ(index)}
            >
              <div className="faq-question">
                <h3>{faq.question}</h3>
                <span className="toggle-icon">
                  {activeIndex === index ? "-" : "+"}
                </span>
              </div>
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FAQList = [
  {
    question: "How long do the meals last?",
    answer:
      "Since we dont use artificial or chemical preservatives, the meals have a refrigerated shelf life of about 4-7 days. Every meal has a 'use by' date on the label.",
  },
  {
    question: "Are meals frozen?",
    answer:
      "No. Grab N Go Express meals are fresh and chilled, so that they're ready to heat-and-eat when you are.",
  },
];

export default FAQ;
