import DishList from "@/components/commons/DishList/DishList";
import React from "react";

const Categories = () => {
  return (
    <>
      <DishList dishes={dishes} from="categories" />
    </>
  );
};

const dishes = [
  {
    id: 1,
    title: "Fresh Meals",
    image: "/img/home/categories/1.webp",
  },
  {
    id: 2,
    title: "Healthy Snacks",
    image: "/img/home/categories/2.webp",
  },
  {
    id: 3,
    title: "Beverages",
    image: "/img/home/categories/3.png",
  },
];

export default Categories;
