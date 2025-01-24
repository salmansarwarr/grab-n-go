import ScrollToTop from "@/components/ScrollToTop/ScrollToTop";
import Footer from "@/components/commons/Footer/Footer";
import Navbar from "@/components/commons/Navbar/Navbar";
import Benifits from "@/components/home/Benifits/Benifits";
import Categories from "@/components/home/Categories/Categories";
import ContactUs from "@/components/home/ContactUs/ContactUs";
import FAQ from "@/components/home/FAQ/FAQ";

import IndieGoGo from "@/components/home/IndieGoGo/IndieGoGo";
import NearestMeal from "@/components/home/NearestMeal/NearestMeal";
import SupportUs from "@/components/home/SupportUs/SupportUs";
import WhySupportUs from "@/components/home/WhySupportUs/WhySupportUs";
import Dishes from "@/components/home/dishes/Dishes";
import AOS from "aos";
import "aos/dist/aos.css";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useEffect } from "react";
const Hero = dynamic(() => import("@/components/home/Hero/Hero"), {
  ssr: false,
});
export default function Home() {
  useEffect(() => {
    AOS.init({
      easing: "ease-out-cubic",
      // once: true,
      offset: 0,
      duration: 1200,
      delay: 100,
    });
  }, []);
  return (
    <>
      <Head>
        <title>Grab N Go Express</title>
        <meta name="description" content="Grab N Go Express" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Navbar />
      <Hero />
      <Dishes />
      <IndieGoGo />
      <Benifits />
      <WhySupportUs />
      <NearestMeal />
      <SupportUs />

      <FAQ />
      <ContactUs />
      <Footer />
      <ScrollToTop/>
    </>
  );
}

//      <Categories />
