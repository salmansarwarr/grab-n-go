import Image from "next/image";
import Link from "next/link";
import { GoArrowUpRight } from "react-icons/go";

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
						<div key={dish.id} className="dish">
							<Image
								className="img-fluid"
								width={285}
								height={225}
								src={dish.image}
								alt="dish1"
							/>
							<div className="btn-group">
								<h3>{dish.title}</h3>
								<Link className="arrow" href="#">
									<GoArrowUpRight />
								</Link>
							</div>
						</div>
					))}
				</div>
				<div className="button">
					<Link className="view-more" href="#">
						View More
					</Link>
				</div>
			</div>
		</section>
	);
};

export default DishList;
