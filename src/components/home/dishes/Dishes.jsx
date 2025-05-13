import DishList from "@/components/commons/DishList/DishList";

const Dishes = () => {
	return (
		<>
			<DishList dishes={dishes} />
		</>
	);
};

const dishes = [
	{
		id: 1,
		title: "Signature Dishes",
		image: "/img/home/dishes/1.webp",
		description: "A flavorful blend of basmati rice stir-fried with tender shredded chicken, crisp seasonal vegetables, and our signature house seasoning. Perfectly balanced and satisfying — a wholesome meal in every bite.",
		ingredients: ["Basmati Rice", "Chicken", "Vegetables", "Signature House Seasoning"],


	},
	{
		id: 2,
		title: "Fresh & Flavorful",
		image: "/img/home/dishes/2.webp",
		description: "A flavorful blend of basmati rice stir-fried with tender shredded chicken, crisp seasonal vegetables, and our signature house seasoning. Perfectly balanced and satisfying — a wholesome meal in every bite.",
		ingredients: ["Basmati Rice", "Chicken", "Vegetables", "Signature House Seasoning"],
	},
	{
		id: 3,
		title: "Quick Bites",
		image: "/img/home/dishes/3.webp",
		description: "A flavorful blend of basmati rice stir-fried with tender shredded chicken, crisp seasonal vegetables, and our signature house seasoning. Perfectly balanced and satisfying — a wholesome meal in every bite.",
		ingredients: ["Basmati Rice", "Chicken", "Vegetables", "Signature House Seasoning"],
	},
];

export default Dishes;
