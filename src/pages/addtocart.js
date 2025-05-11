import Cart from "@/components/cart/Cart";
import Footer from "@/components/commons/Footer/Footer";
import Navbar from "@/components/commons/Navbar/Navbar";
import Head from "next/head";


export default function AddToCart() {

    return (
        <>
            <Head>
                <title>Cart</title>
                <meta name="description" content="Grab N Go Express" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.png" />
            </Head>
            <Navbar />
            <Cart />
            <Footer />
        </>

    );
} 