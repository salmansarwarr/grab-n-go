import React, { useState } from "react";
import Checkout from "@/components/checkout/Checkout";
import Head from "next/head";
import Navbar from "@/components/commons/Navbar/Navbar";
import Footer from "@/components/commons/Footer/Footer";

export default function checkOut() {

    return (
        <>
            <Head>
                <title>Checkout</title>
                <meta name="description" content="Grab N Go Express" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.png" />
            </Head>
            <Navbar />
            <Checkout />
            <Footer />
        </>

    );
} 