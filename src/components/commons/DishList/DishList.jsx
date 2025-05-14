import { useState, useEffect } from "react";
import Link from "next/link";
import DishCard from "./DishCard";
import DishModal from "./DishModal";

const DishList = ({ dishes, from }) => {
	return (
		<section id="dishes">
			<div className="container" data-aos="fade-up">
				{from === "categories" ? (
					<h1 className="title">
						Explore Our Featured Meal <br className="only-desktop" />{" "}
						<span>Categories</span>
					</h1>
				) : (
					<h1 className="title">
						Savor <span>Freshness</span> in Every Bite
					</h1>
				)}
				<div className="dishes" data-aos="fade-up">
					{dishes.map((dish) => (
						<DishCard key={dish.id} dish={dish} onClick={() => {}} />
					))}
				</div>
				<div className="button">
					<Link className="view-more" href="/menu">
						View More
					</Link>
				</div>

			</div>
		</section>
	);
};

export default DishList;
