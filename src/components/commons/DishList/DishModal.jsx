import React, { useState } from "react";
import { useRouter } from "next/router";

const DishModal = ({ dish, onClose }) => {
    if (!dish) return null;
    const [quantity, setQuantity] = useState(1);
    const router = useRouter();

    const handleMinus = (e) => {
        e.stopPropagation();
        setQuantity(q => Math.max(1, q - 1));
    };
    const handlePlus = (e) => {
        e.stopPropagation();
        setQuantity(q => q + 1);
    };
    const handleAddToCart = (e) => {
        e.stopPropagation();
        router.push("/addtocart");
    };

    return (
        <div className="dish-modal-backdrop" onClick={onClose}>
            <div className="dish-modal" onClick={e => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>×</button>
                <div className="dish-modal-content">
                    <div className="dish-modal-image orangish-shadow">
                        <img src={dish.image} alt={dish.title} />
                    </div>
                    <div className="dish-modal-details">
                        <h2 className="dish-modal-title">{dish.title}</h2>
                        <p className="dish-modal-desc">A flavorful blend of basmati rice stir-fried with tender shredded chicken, crisp seasonal vegetables, and our signature house seasoning. Perfectly balanced and satisfying — a wholesome meal in every bite.</p>
                        <div className="dish-modal-price-rating">
                            <span className="dish-modal-price">Price: $10.99</span>
                            <span className="dish-modal-rating">
                                <img src="/img/menu/star.png" alt="star" />
                                <img src="/img/menu/star.png" alt="star" />
                                <img src="/img/menu/star.png" alt="star" />
                                <img src="/img/menu/star.png" alt="star" />
                                <img src="/img/menu/star.png" alt="star" />
                            </span>
                        </div>
                        <hr />
                        <div className="dish-modal-ingredients">
                            <h3>Main Ingredients</h3>
                            <div className="ingredients-list">
                                <div className="ingredient-item">
                                    <div className="ingredient-img" style={{ background: '#ffe5c2' }}><img src="/img/menu/Ellipse 6.png" alt="Mixed Veggies" /></div>
                                    <span>Mixed Veggies</span>
                                </div>
                                <div className="ingredient-item">
                                    <div className="ingredient-img" style={{ background: '#ffe5c2' }}><img src="/img/menu/Ellipse 7.png" alt="Chicken" /></div>
                                    <span>Chicken</span>
                                </div>
                                <div className="ingredient-item">
                                    <div className="ingredient-img" style={{ background: '#ffe5c2' }}><img src="/img/menu/Ellipse 8.png" alt="Basmati Rice" /></div>
                                    <span>Basmati Rice</span>
                                </div>
                                <div className="ingredient-item">
                                    <div className="ingredient-img" style={{ background: '#ffe5c2' }}><img src="/img/menu/Ellipse 9.png" alt="Salmon" /></div>
                                    <span>Salmon</span>
                                </div>
                            </div>
                        </div>
                        <div className="dish-modal-actions">
                            <div className="quantity-selector">
                                <button onClick={handleMinus}>-</button>
                                <span>{quantity}</span>
                                <button onClick={handlePlus}>+</button>
                            </div>
                            <button className="add-to-cart" onClick={handleAddToCart}>Add To Cart</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DishModal; 