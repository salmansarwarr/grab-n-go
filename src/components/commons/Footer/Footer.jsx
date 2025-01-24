import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer>
      <div className="footer-wrapper" data-aos="fade-up">
        <div className="container">
          <div className="row">
            <div className="col-1">
              <div className="footer-logo">
                <Image
                  width={150}
                  height={50}
                  src="/img/footer/logo.svg"
                  alt="logo"
                />
              </div>
              <p className="description">
                Frictionless. <br /> Contact-Free. <br /> Operational 24/7.
              </p>
              <div className="social-icons">
                <Link
                  href="https://www.facebook.com/profile.php?id=100089372959376"
                  target="_blank"
                >
                  <FaFacebookF />
                </Link>
                <Link
                  href="https://www.instagram.com/grabngoexpress"
                  target="_blank"
                >
                  <FaInstagram />
                </Link>
              </div>
            </div>

            <div className="col-2">
              <h3>Quick links</h3>
              <ul>
                <li>
                  <Link href="#">Home</Link>
                </li>
                <li>
                  <Link href="/about-us">About</Link>
                </li>
                <li>
                  <Link href="#">Faq</Link>
                </li>
                <li>
                  <Link href="#">Contact</Link>
                </li>
              </ul>
            </div>

            <div className="col-3">
              <h3>Terms</h3>
              <ul>
                <li>
                  <Link href="#">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="#">Terms and conditions</Link>
                </li>
                {/* <li>
                  <Link href="#">lorem ipsum</Link>
                </li> */}
              </ul>
            </div>

            {/*  <div className="col-4">
              <h3>Find nearest mealpoint</h3>
              <div className="input-form">
                <div className="input-field">
                  <IoLocationOutline />
                  <input type="text" placeholder="Find your meals" />
                </div>
                <button>
                  <CiSearch />
                </button>
              </div>
            </div> */}
          </div>
          <hr />
          <div className="copyright-text">
            <p>Copyright 2024, All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
