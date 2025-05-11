import React from "react";
import { QRCodeCanvas } from "qrcode.react";

const OrderSuccessModal = ({ open, onClose, order }) => {
    if (!open) return null;
    // Dummy order data if not provided
    const orderData = order || {
        code: "#0123_45678",
        total: "$1,345.00",
        payment: "Credit Card",
        items: [
            { image: "/img/menu/Ellipse 6.png", qty: 2 },
            { image: "/img/menu/Ellipse 6.png", qty: 1 },
            { image: "/img/menu/Ellipse 6.png", qty: 2 },
        ],
    };
    // Generate a unique QR value (could be order code + timestamp)
    const qrValue = JSON.stringify({
        code: orderData.code,
        total: orderData.total,
        payment: orderData.payment,
        ts: Date.now(),
    });

    return (
        <div className="order-success-backdrop" style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.1)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(16px)', padding: '2rem'
        }} onClick={onClose}>
            <div className="order-success-modal" onClick={e => e.stopPropagation()}>
                <h2 className="order-success-title">Thank you! <span role="img" aria-label="celebrate">🎉</span></h2>
                <h1 className="order-success-placed">Your order has been Placed</h1>
                <p className="order-success-desc">Proceed to pickup location and scan QR Code to pickup your order</p>
                <div className="order-success-items">
                    {orderData.items.map((item, i) => (
                        <div className="order-success-item" key={i}>
                            <img src={item.image} alt="item" />
                            <span className="order-success-qty">{item.qty}</span>
                        </div>
                    ))}
                </div>
                <div className="order-success-details">
                    <div className="order-success-info">
                        <div><span>Order code:</span> <b>{orderData.code}</b></div>
                        <div><span>Total:</span> <b>{orderData.total}</b></div>
                        <div><span>Payment method:</span> <b>{orderData.payment}</b></div>
                        <div style={{ fontSize: '14px', fontWeight: 400, marginTop: 10 }}>*Scan QR Code to pickup your order</div>
                    </div>
                    <div className="order-success-qr">
                        <QRCodeCanvas value={qrValue} size={150} />

                    </div>
                </div>
                <style jsx>{`
          .order-success-backdrop {
            position: fixed;
            top: 0; left: 0;
            right: 0; bottom: 0;
             width: 100vw; height: 100vh;
            background: rgba(0,0,0,0.1);
            backdrop-filter: blur(16px);
            display: flex; align-items: center; justify-content: center;
            z-index: 3000;
            padding: 2rem;
          }
          .order-success-modal {
            background: #fff;
            border: 1px solid #FF8B0080;
            border-radius: 28px;
            padding: 2.5rem 2.5rem 2rem 2.5rem;
            min-width: 740px;
            max-width: 740px;
            text-align: center;
            position: relative;
          }
          .order-success-title {
            font-size: 28px;
            font-weight: 500;
            margin-bottom: 0.5rem;
            color: #6C7275;
          }
          .order-success-placed {
            font-size: 40px;
            font-weight: 500;
            margin-bottom: 0.5rem;
            color: #23262F;
          }
          .order-success-desc {
            color: #141718;
            font-size: 14px;
            font-family: var(--font-gt-figtree);
            margin-bottom: 1.5rem;
          }
          .order-success-items {
            display: flex;
            justify-content: center;
            gap: 2.2rem;
            margin-bottom: 1.7rem;
            padding: 20px 0px;
          }
          .order-success-item {
            position: relative;
            width: 100px;
            height: 128px;
            display: inline-block;
          }
          .order-success-item img {
            width: 100%;
            height: 100%;
            border-radius: 18px;
            object-fit: contain;
          }
          .order-success-qty {
            position: absolute;
            top: -8px; right: -8px;
            background: #FF8B00;
            color: #fff;
            font-weight: 700;
            font-size: 1.1rem;
            border-radius: 50%;
            width: 32px; height: 32px;
            display: flex; align-items: center; justify-content: center;
          }
          .order-success-details {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-top: 1.2rem;
            gap: 2.5rem;
            max-width: 480px;
            margin: 0 auto;
          }
          .order-success-info {
            text-align: left;
            flex: 1;
          }
          .order-success-info div {
            padding: 10px 0;
          }
          .order-success-info span {
            font-size: 14px;
            font-family: var(--font-gt-figtree);
            font-weight: 600;
            color: #6C7275;
            min-width: 110px;
            display: inline-block;
            margin-right: 10px;
          }
          .order-success-qr {
            flex: none;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        `}</style>
            </div>
        </div>
    );
};

export default OrderSuccessModal; 