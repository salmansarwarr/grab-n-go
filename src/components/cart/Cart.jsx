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
              <div className="cart-product-details">
                <div className="cart-title">{item.title}</div>
                <div className="cart-type">{item.type}</div>
                <button className="cart-remove" onClick={() => handleRemove(item.id)}>✕ Remove</button>
              </div>
            </div>
            {/* Desktop grid columns */}
            <div className="cart-qty desktop-only">
              <button onClick={() => handleQuantity(item.id, -1)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => handleQuantity(item.id, 1)}>+</button>
            </div>
            <div className="cart-price desktop-only">${item.price.toFixed(2)}</div>
            <div className="cart-subtotal desktop-only">${(item.price * item.quantity).toFixed(2)}</div>
            {/* Tablet/mobile row grouping */}
            <div className="cart-info-row mobile-only">
              <div className="cart-qty">
                <button onClick={() => handleQuantity(item.id, -1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => handleQuantity(item.id, 1)}>+</button>
              </div>
              <div className="cart-price">${item.price.toFixed(2)}</div>
              <div className="cart-subtotal">${(item.price * item.quantity).toFixed(2)}</div>
            </div>
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
          <span><b> ${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</b></span>
        </div>
        <div className="summary-row total">
          <span>Total</span>
          <span>${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
        <Link href="/checkout">
          <button className="checkout-btn">Checkout</button>
        </Link>
      </div>
    </div>
  )
}

export default Cart
