// components/ScrollToTop.js
import { useState, useEffect } from "react";
import { FaArrowUpLong  } from "react-icons/fa6";

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);

        return () => {
            window.removeEventListener("scroll", toggleVisibility);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <div>
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className="scrollToTopButton"
                    aria-label="Scroll to top"
                >
                    <FaArrowUpLong size={20}  />
                </button>
            )}
        </div>
    );
};

export default ScrollToTop;
