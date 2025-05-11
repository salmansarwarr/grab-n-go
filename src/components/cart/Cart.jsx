import Link from "next/link";
import React, { useState } from "react";

const initialCart = [
    {
        id: 1,
        title: "Chicken Fried Rice",
        type: "Non-veg",
        image: "/img/menu/menu-image1.png",
        price: 19.0,
        quantity: 2,
    },
    {
        id: 2,
        title: "Baked Sweet Potato",
        type: "veg",
        image: "/img/menu/menu-image2.png",
        price: 19.0,
        quantity: 3,
    },
    {
        id: 3,
        title: "Jollof Spaghetti",
        type: "veg",
        image: "/img/menu/menu-image3.png",
        price: 19.0,
        quantity: 1,
    },
];

const Cart = () => {
    const [cart, setCart] = useState(initialCart);

    const handleQuantity = (id, delta) => {
        setCart(cart => cart.map(item =>
            item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
        ));
    };

    const handleRemove = (id) => {
        setCart(cart => cart.filter(item => item.id !== id));
    };

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const total = subtotal; // Example: add a fixed fee for demo

    return (
        <div className="container addtocart-page">
            <div className="cart-list">
                <div className="cart-header">
                    <span>Product</span>
                    <span>Quantity</span>
                    <span>Price</span>
                    <span>Subtotal</span>
                </div>
                {cart.map(item => (
                    <div className="cart-row" key={item.id}>
                        <div className="cart-product">
                            <div className="cart-product-image">
                                <img src={item.image} alt={item.title} />
                            </div>
                            <div>
                                <div className="cart-title">{item.title}</div>
                                <div className="cart-type">{item.type}</div>
                                <button className="cart-remove" onClick={() => handleRemove(item.id)}>✕ Remove</button>
                            </div>
                        </div>
                        <div className="cart-qty">
                            <button onClick={() => handleQuantity(item.id, -1)}>-</button>
                            <span>{item.quantity}</span>
                            <button onClick={() => handleQuantity(item.id, 1)}>+</button>
                        </div>
                        <div className="cart-price">${item.price.toFixed(2)}</div>
                        <div className="cart-subtotal">${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                ))}
            </div>
            <div className="cart-summary">
                <h3>Cart summary</h3>
                <div className="cart-summary-select">
                    <p>Pickup</p>
                </div>
                <div className="summary-row">
                    <span>Subtotal</span>
                    <span>${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="summary-row total">
                    <span>Total</span>
                    <span>${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <Link href="/checkout">
                    <button className="checkout-btn">Checkout</button>
                </Link>
            </div>
            <style jsx>{`
      .addtocart-page {
        display: flex;
        gap: 2.5rem;
        padding: 5rem 2rem;
        // min-height: 100vh;
      }
      .cart-list {
        flex: 2;
      }
      .cart-header {
        display: grid;
        grid-template-columns: 2.5fr 1.2fr 1fr 1fr;
        font-weight: 500;
        font-size: 18px;
        color: #181818;
        border-bottom: 2px solid #eee;
        padding-bottom: 0.7rem;
        margin-bottom: 1.2rem;
      }
      .cart-row {
        display: grid;
        grid-template-columns: 2.5fr 1.2fr 1fr 1fr;
        align-items: center;
        border-bottom: 1px solid #E8ECEF;
        padding: 1.1rem 0;
      }
      .cart-product {
        display: flex;
        align-items: center;
        gap: 1.2rem;
      }
      .cart-product-image {
        width: 70px;
        height: 70px;
        border-radius: 16px;
      }
      .cart-product-image img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
      .cart-title {
        font-weight: 500;
        margin-bottom: 0.4rem;
        font-size: 18px;
      }
      .cart-type {
        color: #666666;
        font-size: 14px;
        margin-bottom: 0.3rem;
      }
      .cart-remove {
        background: none;
        border: none;
        color: #666666;
        font-size: 16px;
        cursor: pointer;
        margin-top: 0.2rem;
        padding: 0;
      }
      .cart-qty {
        display: flex;
        align-items: center;
        gap: 0.7rem;
        background: #fafbfc;
        border: 1px solid #666666;
        border-radius: 6px;
        padding: 0.3rem 0.8rem;
        width: fit-content ;
        font-size: 14px;
        font-weight: 600;
      }
      .cart-qty button {
        font-size: 1.2rem;
        cursor: pointer;
        display: flex;
        border: none;
        background: none;
        align-items: center;
        justify-content: center;
      }
      .cart-price {
        font-size: 20px;
        color: #181818;
        font-weight: 400;
      }
    .cart-subtotal {
        font-size: 20px;
        color: #181818;
        font-weight: 600;
      }
      .cart-summary {
        flex: 1;
        background: #fff;
        border: 1px solid #18181866;
        border-radius: 16px;
        padding: 2rem 2rem 1.5rem 2rem;
        height: fit-content;
        min-width: 460px;
      }
      .cart-summary h3 {
        font-size: 22px;
        font-weight: 500;
        margin-bottom: 1.2rem;
      }
      .cart-summary .cart-summary-select p {
        width: 100%;
        background: #30DD001A;
        border: 1.5px solid #30DD0066;
        border-radius: 7px;
        padding: 0.7rem 1rem;
        font-size: 16px;
        font-weight: 400;
        margin-bottom: 1.2rem;
      }
      .summary-row {
        display: flex;
        justify-content: space-between;
        font-size: 18px;
        font-weight: 400;
        margin-bottom: 0.7rem;
      }
      .summary-row.total {
        font-weight: 600;
        font-size: 22px;
        margin-top: 1.2rem;
      }
      .checkout-btn {
        width: 100%;
        background: #30DD00;
        color: #fff;
        border: none;
        border-radius: 8px;
        padding: 0.9rem 0;
        font-size: 1.1rem;
        font-weight: 600;
        margin-top: 1.5rem;
        cursor: pointer;
        transition: background 0.2s;
        margin-top: 4rem;
      }
      .checkout-btn:hover {
        background: #13b013;
      }
      @media (max-width: 900px) {
        .addtocart-page {
          flex-direction: column;
          gap: 1.5rem;
          padding: 4rem 2rem;
        }
        .cart-summary {
          min-width: unset;
          width: 100%;
        }
      }
    `}</style>
        </div>
    )
}

export default Cart
