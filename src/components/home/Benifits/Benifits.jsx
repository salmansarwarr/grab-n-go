import { useState } from "react";
import { GoArrowUpRight } from "react-icons/go";

const Benifits = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <section id="benifits">
      <div className="container" data-aos="fade-up">
        <h1 className="title">
          <span>Our</span> Benefits
        </h1>
        <p className="description">
          We provide fresh, ready-to-eat meals with the latest in food vending
          technology, ensuring you enjoy a nutritious meal anytime, anywhere.
        </p>
        {BenifitsList.map((benifit, index) => (
          <div className="benifits" key={index}>
            <div
              className={`benifit ${activeIndex === index ? "active" : ""}`}
              onClick={() => handleClick(index)}
            >
              <div className="benifit-title-wrapper">
                <span className="serial">{benifit.serial}</span>
                <h2 className="benifit-title">{benifit.title}</h2>
              </div>
              <p className="benifit-description">{benifit.description}</p>
              <div className="arrow-icon">
                <GoArrowUpRight />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const BenifitsList = [
  {
    serial: "01",
    title: "Chef-Crafted Meals",
    description:
      "Say goodbye to processed fast food. \
Our meals are crafted with care by local chefs, offering quality and flavor you can trust.",
  },
  {
    serial: "02",
    title: "Accessible Food",
    description:
      "From hospitals to EV charging stations, our vending container will be placed where you need them most.",
  },
  {
    serial: "03",
    title: "Powered By Ai",
    description:
      "Al tailors menus and locations to deliver fresh, chef-prepared meals wherever you need them.",
  },
  {
    serial: "04",
    title: "Eco Friendly",
    description:
      "Our microwave-safe containers are sustainable, making it easy to eat well with a clear conscience.",
  },
  {
    serial: "05",
    title: "Affordable options",
    description:
      "We offer a range of pricing options designed to make fresh, chef-prepared meals accessible to all.",
  },
];

export default Benifits;
