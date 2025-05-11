import { useEffect, useState } from "react";
import DishCard from "../commons/DishList/DishCard";
import DishModal from "../commons/DishList/DishModal";

const MenuList = ({ dishes }) => {
    const [selectedDish, setSelectedDish] = useState(null);

    const handleCardClick = (dish) => {
        setSelectedDish(dish);
    };
    useEffect(() => {
		if (selectedDish) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => {
			document.body.style.overflow = '';
		};
	}, [selectedDish]);

    const handleClose = () => {
        setSelectedDish(null);
    };
    return (
        <>
            <section id="dishes">
                <div className="container" data-aos="fade-up">
                    <div className="dishes" data-aos="fade-up">
                        {dishes.map((dish) => (
                            <DishCard key={dish.id} dish={dish} onClick={() => handleCardClick(dish)} />
                        ))}
                    </div>
                </div>
            </section>
            {selectedDish && (
                <DishModal dish={selectedDish} onClose={handleClose} />
            )}
        </>
    );
};

export default MenuList
