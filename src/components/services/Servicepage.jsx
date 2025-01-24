import React, { useState } from 'react'
import { GoArrowUpRight } from 'react-icons/go';

const Servicepage = () => {

    const [activeIndex, setActiveIndex] = useState(0);

    const handleClick = (index) => {
        setActiveIndex(index);
    };

    return (
        <>
            <section id="about-us">
                <div className="container">
                    <h1 className="title">
                        Our <span>Services</span>
                    </h1>
                    <p className="description">
                        Imagine a world where fast food doesn’t mean unhealthy food. At Grab N Go Express, we’re bringing fresh, chef-prepared meals to your fingertips 24/7. With vending containers strategically placed in high-traffic locations, we’re bridging the gap between convenience and health.
                    </p>
                </div>

                <div className="container">
                    <h1 className="title-heading" >
                        Freshness meets <span> accessibility </span>
                    </h1>
                    <p className="about-content-heading">
                        We believe everyone deserves access to nutritious, affordable, and delicious meals—anytime, anywhere. That’s why our vending containers deliver chef-crafted, never-frozen meals designed to fit your busy lifestyle. Whether you’re at an airport, hospital, or downtown, Grab N Go Express is your go-to for quick, wholesome meals.
                    </p>
                </div>

                <div className="container">
                    <h1 className="title-heading" >
                        The <span>problem</span> we’re solving
                    </h1>
                    <p className="about-content-heading">
                        In a world where time is short, people often sacrifice health for convenience. Fast food dominates, especially in “fresh food deserts,” where access to nutritious meals is limited. Grab N Go Express brings fresh, healthy options directly to underserved communities, helping people make better food choices without the hassle.

                    </p>
                </div>

                <div className="container">
                    <h1 className="title-heading" >
                        <span>Strategic</span> placement
                    </h1>
                    <p className="about-content-heading">
                        Meeting you where you are - strategic placement <br />
                        Airports | Hospitals | Construction sites | Office buildings | EV charging stations | Hotels | Shopping Retailers
                    </p>
                </div>
            </section>

            <section id="benifits">
                <div className="container" data-aos="fade-up">
                    <h1 className="title">
                        How it <span> works </span>
                    </h1>
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
        </>
    )
}


const BenifitsList = [
    {
        serial: "01",
        title: "Find a location",
        description:
            "Locate a Grab N Go Express vending container.",
    },
    {
        serial: "02",
        title: "Choose your meal",
        description:
            "Select from a variety of fresh, chef prepared options.",
    },
    {
        serial: "03",
        title: "Heat & Enjoy",
        description:
            "Meals are portioned in microwave safe containers- just heat for 1-2 minutes at your home, office or on the go.",
    },
];


export default Servicepage