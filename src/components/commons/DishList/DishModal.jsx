import React, { useState } from "react";
import { useRouter } from "next/router";
import { FaCross, FaX } from "react-icons/fa6";

const DishModal = ({ dish, isHome, onClose }) => {
    if (!dish) return null;
    const [quantity, setQuantity] = useState(1);
    const router = useRouter();

    const handleMinus = (e) => {
        e.stopPropagation();
        setQuantity((q) => Math.max(1, q - 1));
    };
    const handlePlus = (e) => {
        e.stopPropagation();
        setQuantity((q) => q + 1);
    };
    const handleAddToCart = (e) => {
        e.stopPropagation();
        router.push("/addtocart");
    };

    const ingredientIcons = {
        "Jerk chicken": "Ellipse 7.png",
        "Jerk gravy": "sause.png",
        "Mashed potatoes": "potato.png",
        "Sautéed kale": "kale.png",
        "Mushroom": "mushroom.png",
        "Cherry tomatoes": "cherry-tomato.png",
        "Spinach": "spinach.png",
        "Fried rice": "fried-rice.png",
        "Chicken": "chicken.png",
        "Vegetables": "vegetables.png",
        "Ground beef": "beef-steak.png",
        "Beef sausage": "meat.png",
        "Spaghetti pasta": "spaghetti.png",
        "Fresh spinach": "spinach.png",
        "Mixed veggies": "vegetables.png",
        "Basmati Rice": "Ellipse 8.png",
        "Salmon": "salmon.png",
        "Sweet potatoes": "potato.png",
        "Sweet peppers": "pepper.png"
    };


    return (
        <div className="dish-modal-backdrop" onClick={onClose}>
            <div className="dish-modal" onClick={(e) => e.stopPropagation()}>
                <div className="dish-modal-close-btn">
                    <button className="close-btn" onClick={onClose}>
                        <FaX />
                    </button>
                </div>

                <div className="dish-modal-inner" onClick={(e) => e.stopPropagation()}>
                    <div className="dish-modal-content">
                        <div className="dish-modal-image-container">
                            <div
                                className={`${isHome ? "dish-modal-image-home" : "dish-modal-image"
                                    }`}
                            >
                                <img src={dish.image} alt={dish.title} />
                                <div className="fading-shadow"></div>
                            </div>
                        </div>
                        <div className="dish-modal-details">
                            <h2 className="dish-modal-title">{dish.title}</h2>
                            <p className="dish-modal-desc">{dish.description}</p>
                            <div className="dish-modal-price-rating">
                                <span className="dish-modal-price">Price: $10.99</span>
                                <span className="dish-modal-rating">
                                    <img src="/img/menu/STAR.png" alt="star" />
                                    <img src="/img/menu/STAR.png" alt="star" />
                                    <img src="/img/menu/STAR.png" alt="star" />
                                    <img src="/img/menu/STAR.png" alt="star" />
                                    <img src="/img/menu/STAR.png" alt="star" />
                                </span>
                            </div>
                            <hr />
                            <div className="dish-modal-ingredients">
                                <h3>Main Ingredients</h3>
                                {/* <div className="ingredients-list">
                                    <div className="ingredient-item">
                                        {
                                            dish.ingredients[0] && (
                                                <>
                                                    <div className="ingredient-img" style={{ background: '#ffe5c2' }}><img src="/img/menu/Ellipse 6.png" alt="Mixed Veggies" /></div>
                                                    <span>{dish.ingredients[0]}</span>
                                                </>
                                            )
                                        }

                                    </div>
                                    {
                                        dish.ingredients[1] && (
                                            <div className="ingredient-item">
                                                <div className="ingredient-img" style={{ background: '#ffe5c2' }}><img src="/img/menu/Ellipse 7.png" alt="Chicken" /></div>
                                                <span>{dish.ingredients[1]}</span>
                                            </div>
                                        )
                                    }
                                    {
                                        dish.ingredients[2] && (
                                            <div className="ingredient-item">
                                                <div className="ingredient-img" style={{ background: '#ffe5c2' }}><img src="/img/menu/Ellipse 8.png" alt="Basmati Rice" /></div>
                                                <span>{dish.ingredients[2]}</span>
                                            </div>
                                        )
                                    }
                                    {
                                        dish.ingredients[3] && (
                                            <div className="ingredient-item">
                                                <div className="ingredient-img" style={{ background: '#ffe5c2' }}><img src="/img/menu/Ellipse 9.png" alt="Salmon" /></div>
                                                <span>{dish.ingredients[3]}</span>
                                            </div>
                                        )
                                    }
                                </div> */}
                                <div className="ingredients-list">
                                    {dish.ingredients.map((ingredient, i) => {
                                        const iconName = ingredientIcons[ingredient];
                                        const iconPath = iconName
                                            ? `/img/menu/${iconName}`
                                            : "/img/menu/Ellipse 6.png"; // fallback

                                        return (
                                            <div key={i} className="ingredient-item">
                                                <div className="ingredient-img" style={{ background: '#ffe5c2' }}>
                                                    <img src={iconPath} alt={ingredient} />
                                                </div>
                                                <span>{ingredient}</span>
                                            </div>
                                        );
                                    })}
                                </div>

                            </div>
                            <div className="dish-modal-actions">
                                <div className="quantity-selector">
                                    <button onClick={handleMinus}>-</button>
                                    <span>{quantity}</span>
                                    <button onClick={handlePlus}>+</button>
                                </div>
                                <button className="add-to-cart" onClick={handleAddToCart}>
                                    Add To Cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DishModal;
