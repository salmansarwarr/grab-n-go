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


	},
	{
		id: 2,
		title: "Fresh & Flavorful",
		image: "/img/home/dishes/2.webp",
	},
	{
		id: 3,
		title: "Quick Bites",
		image: "/img/home/dishes/3.webp",
	},
];

export default Dishes;
