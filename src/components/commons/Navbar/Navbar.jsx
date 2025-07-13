import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { RxCross1, RxHamburgerMenu } from "react-icons/rx";
import { useSwipeable } from "react-swipeable";

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleCloseMenu = () => {
    setMenuOpen(false);
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (menuOpen) handleCloseMenu();
    },
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <nav
      {...swipeHandlers}
      id="navbar"
      className={`navbar ${isVisible ? "visible" : "hidden"}`}
    >
      <div className="nav-wrapper">
        {/* LOGO */}
        <div className="logo">
          <Link href="/">
            <Image
              alt="Logo"
              width={150}
              height={50}
              src="/img/Navbar/logo.svg"
            />
          </Link>
        </div>

        {/* HAMBURGER MENU */}
        {/* <input type="checkbox" id="check" />
        <label htmlFor="check" className="checkbtn">
          <RxHamburgerMenu />
        </label> */}
        <input
          type="checkbox"
          id="check"
          checked={menuOpen}
          onChange={handleMenuToggle}
          style={{ display: "none" }} // Hide the checkbox itself
        />
        <label htmlFor="check" className="checkbtn">
          {menuOpen ? <RxCross1 /> : <RxHamburgerMenu />}
        </label>

        {/* NAV LINKS */}
        <ul>
          <li>
            <Link href="/about-us">About Us</Link>
          </li>
          <li>
            <Link href="/menu">Menu</Link>
          </li>
          {/* <li>
            <Link href="/addtocart">Cart</Link>
          </li> */}
          <li>
            <Link href="#faq">FAQ</Link>
          </li>
          <li>
            <Link href="#contact-us">Contact</Link>
          </li>
          <div className="menu-btn">
            {/* <Link
              target="_blank"
              href="https://www.indiegogo.com/projects/grab-n-go-express#/"
            >
              Partner with us
            </Link> */}
            <Link href="/partner-with-us">Partner with us</Link>
          </div>
        </ul>
        <div className="btn">
          <Link href="/partner-with-us">Partner with us</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
