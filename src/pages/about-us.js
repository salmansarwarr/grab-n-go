import AboutPage from "@/components/about/AboutPage";
import Footer from "@/components/commons/Footer/Footer";
import Navbar from "@/components/commons/Navbar/Navbar";
import ScrollToTop from "@/components/ScrollToTop/ScrollToTop";
import Head from "next/head";
import React from "react";

const AboutUs = () => {
  return (
    <>
      <Head>
        <title>About Us</title>
        <meta name="description" content="About Us Page" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Navbar />
      <AboutPage />
      <Footer />
      <ScrollToTop/>

    </>
  );
};

export default AboutUs;
