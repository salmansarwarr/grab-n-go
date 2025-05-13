import React, { useState } from "react";
import OrderSuccessModal from "./OrderSuccessModal";

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
                <style jsx>{`
                    .checkout-page {
                    display: flex;
                    gap: 2.5rem;
                    padding: 5rem 0rem;
                    }
                    .checkout-form {
                    flex: 2;
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                    }
                    .checkout-section {
                    border-radius: 16px;
                    border: 1px solid #18181866;
                    padding:44px 26px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.18);

                    }
                    .checkout-section h3 {
                    font-size: 22px;
                    font-weight: 500;
                    color: #181818;
                    margin-bottom: 2rem;
                    }
                    .form-row {
                    display: flex;
                    gap: 1.2rem;
                    margin-bottom: 1.1rem;
                    }
                    .form-group {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    }
                    .form-group label {
                    font-size: 14px;
                    font-weight: 700;
                    color: #666666;
                    margin-bottom: 0.8rem;
                    }
                    .form-group input {
                    border: 1.5px solid #CBCBCB;
                    border-radius: 7px;
                    padding: 0.8rem 1.2rem;
                    font-size: 16px;
                    font-weight: 400;
                    }
                    .payment-methods {
                    display: flex;
                    flex-direction: column;
                    gap: 0.7rem;
                    border-bottom: 1px solid #666666;
                    padding-bottom: 26px;
                    margin-bottom: 26px;
                    }
                    .payment-methods label {
                    display: flex;
                    align-items: center;
                    gap: 0.7rem;
                    border: 1.5px solid #CBCBCB;
                    border-radius: 7px;
                    padding: 1rem 1.2rem;
                    font-size: 1.05rem;
                    cursor: pointer;
                    }
                    .payment-methods label.active {
                    border: 1.5px solid #30DD0066;
                    background: #30DD001A;
                    }
                    .payment-methods input[type="radio"] {
                    accent-color: black;
                    height: 20px; 
                    width: 20px;
                    }
                    .place-order-btn {
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
                    }
                    .place-order-btn:hover {
                    background: #13b013;
                    }
                    .place-order-btn[disabled] {
                    opacity: 0.6;
                    cursor: not-allowed;
                    }
                    .order-summary {
                    flex: 1;
                    background: #fff;
                    border-radius: 16px;
                    padding: 2rem 2rem 1.5rem 2rem;
                    border: 1px solid #18181866;
                    height: fit-content;
                    min-width: 480px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.18);

                    }
                    .order-summary h3 {
                    font-size: 31px;
                    font-weight: 500;
                    margin-bottom: 16px;
                    }
                    .summary-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    font-size: 1.08rem;
                    margin-bottom: 0.7rem;
                    border-bottom: 1px solid #E8ECEF;
                    padding-bottom: 1.5rem;
                    }
                    .summary-row.subtotal {
                    font-weight: 400;
                    font-family: figtree;
                    font-size: 18px;
                    color: #181818;
                    margin-top: 30px;
                    }
                    .summary-row.subtotal span:nth-child(2) {
                    font-weight: 600;
                    }
                    .summary-row.total {
                    font-weight: 500;
                    font-size: 22px;
                    font-family: figtree;
                    margin-top: 1.2rem;
                    border-bottom: none;
                    }
                    .summary-product {
                    display: flex;
                    align-items: center;
                    gap: 1.2rem;
                    margin: 16px 0;
                    }
                    .summary-product-image {
                    width: 100px;

                    height: 128px;
                    }
                    .summary-product-image img {
                    width: 100%;
                    height: 100%;
                    border-radius: 16px;
                    object-fit: contain;
                    }
                    .summary-title {
                    font-weight: 500;
                    font-size: 16px;
                    margin-bottom: 8px;   
                    }
                    .summary-type {
                    color: #666666;
                    font-size: 14px;
                    font-weight: 400;
                    margin-bottom: 8px;
                    }
                    .summary-remove {
                    background: none;
                    border: none;
                    color: #666666;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    margin-top: 0.2rem;
                    padding: 0;
                    }
                    .summary-price {
                    font-weight: 600;
                    font-family: figtree;
                    font-size: 20px;
                    }
                    .input-error {
                    color: #e53935;
                    font-size: 0.92rem;
                    margin-top: 0.2rem;
                    }
                    @media (max-width: 900px) {
                    .checkout-page {
                        flex-direction: column;
                        gap: 1.5rem;
                        padding: 4rem 2rem;
                    }
                        .form-row {
                            flex-direction: column;
                        }
                        .order-summary {
                            min-width: unset;
                            width: 100%;
                        }
                    }
                `}</style>
            </div>
            <OrderSuccessModal open={showSuccess} onClose={() => setShowSuccess(false)} order={orderSuccessData} />
        </>

    );
}

