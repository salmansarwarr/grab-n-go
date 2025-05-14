import React, { useState } from "react";
import OrderSuccessModal from "./OrderSuccessModal";
import "./Checkout.scss";

export default function Checkout() {
    const [payment, setPayment] = useState("card");
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        card: "",
        exp: "",
        cvc: "",
    });
    const [errors, setErrors] = useState({});
    const [showSuccess, setShowSuccess] = useState(false);
    const orderItems = [
        {
            id: 1,
            title: "Chicken Fried Rice",
            type: "Non-veg",
            image: "/img/menu/menu-image1.png",
            price: 38.0,
            qty: 2,
        },
        {
            id: 2,
            title: "Chicken Fried Rice",
            type: "Non-veg",
            image: "/img/menu/menu-image2.png",
            price: 38.0,
            qty: 1,
        },
        {
            id: 3,
            title: "Chicken Fried Rice",
            type: "Non-veg",
            image: "/img/menu/menu-image3.png",
            price: 38.0,
            qty: 2,
        },
    ];
    const subtotal = 99.0;
    const total = 234.0;

    // Validation logic
    const validate = () => {
        const newErrors = {};
        if (!form.firstName) newErrors.firstName = "First name is required.";
        if (!form.lastName) newErrors.lastName = "Last name is required.";
        if (!form.phone) newErrors.phone = "Phone number is required.";
        if (!form.email) newErrors.email = "Email is required.";
        if (payment === "card") {
            if (!form.card) newErrors.card = "Card number is required.";
            if (!form.exp) newErrors.exp = "Expiration date is required.";
            if (!form.cvc) newErrors.cvc = "CVC is required.";
        }
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validate();
        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            setShowSuccess(true);
        }
    };

    // Prepare order data for modal
    const orderSuccessData = {
        code: `#${Math.floor(Math.random() * 10000)}_${Date.now().toString().slice(-5)}`,
        total: `$${(total * 5.75).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
        payment: payment === "card" ? "Credit Card" : "Cryptocurrency",
        items: orderItems.map(i => ({ image: i.image, qty: i.qty })),
    };

    return (
        <>
            <div className="container checkout-page">
                <form className="checkout-form" onSubmit={handleSubmit}>
                    <div className="checkout-section">
                        <h3>Personal information</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label>FIRST NAME</label>
                                <input type="text" placeholder="First name" value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} />
                                {errors.firstName && <div className="input-error">{errors.firstName}</div>}
                            </div>
                            <div className="form-group">
                                <label>LAST NAME</label>
                                <input type="text" placeholder="Last name" value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} />
                                {errors.lastName && <div className="input-error">{errors.lastName}</div>}
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>PHONE NUMBER</label>
                                <input type="text" placeholder="Phone number" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                                {errors.phone && <div className="input-error">{errors.phone}</div>}
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>EMAIL ADDRESS</label>
                                <input type="email" placeholder="Your Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                                {errors.email && <div className="input-error">{errors.email}</div>}
                            </div>
                        </div>
                    </div>
                    <div className="checkout-section">
                        <h3>Payment method</h3>
                        <div className="payment-methods">
                            <label className={payment === "card" ? "active" : ""}>
                                <input type="radio" name="payment" checked={payment === "card"} onChange={() => setPayment("card")} />
                                <span>Pay by Credit Card</span>
                            </label>
                            <label className={payment === "crypto" ? "active" : ""}>
                                <input type="radio" name="payment" checked={payment === "crypto"} onChange={() => setPayment("crypto")} />
                                <span>Pay with Cryptocurrency</span>
                            </label>
                        </div>
                        {payment === "card" && (
                            <>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>CARD NUMBER</label>
                                        <input type="text" placeholder="1234 1234 1234" value={form.card} onChange={e => setForm(f => ({ ...f, card: e.target.value }))} />
                                        {errors.card && <div className="input-error">{errors.card}</div>}
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>EXPIRATION DATE</label>
                                        <input type="text" placeholder="MM/YY" value={form.exp} onChange={e => setForm(f => ({ ...f, exp: e.target.value }))} />
                                        {errors.exp && <div className="input-error">{errors.exp}</div>}
                                    </div>
                                    <div className="form-group">
                                        <label>CVC</label>
                                        <input type="text" placeholder="CVC code" value={form.cvc} onChange={e => setForm(f => ({ ...f, cvc: e.target.value }))} />
                                        {errors.cvc && <div className="input-error">{errors.cvc}</div>}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                    <button className="place-order-btn">Place Order</button>
                </form>
                <div className="order-summary">
                    <h3>Order summary</h3>
                    {orderItems.map((item, i) => (
                        <div className="summary-row" key={i}>
                            <div className="summary-product">
                                <div className="summary-product-image">
                                    <img src={item.image} alt={item.title} />
                                </div>
                                <div>
                                    <div className="summary-title">{item.title}</div>
                                    <div className="summary-type">{item.type}</div>
                                    <button className="summary-remove">✕ Remove</button>
                                </div>
                            </div>
                            <div className="summary-price">${item.price.toFixed(2)}</div>
                        </div>
                    ))}
                    <div className="summary-row subtotal">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="summary-row total">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                </div>
            </div>
            <OrderSuccessModal open={showSuccess} onClose={() => setShowSuccess(false)} order={orderSuccessData} />
        </>
    );
}

