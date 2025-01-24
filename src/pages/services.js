import Footer from '@/components/commons/Footer/Footer'
import Navbar from '@/components/commons/Navbar/Navbar'
import ScrollToTop from '@/components/ScrollToTop/ScrollToTop';
import Servicepage from '@/components/services/Servicepage';
import Head from "next/head";
import React from 'react'

const services = () => {
    return (
        <>
            <Head>
                <title>Service</title>
                <meta name="description" content="Service Page" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.png" />
            </Head>
            <Navbar />
            <Servicepage />
            <Footer />
            <ScrollToTop />

        </>
    )
}

export default services