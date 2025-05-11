import Image from "next/image";
import Link from "next/link";
import { GoArrowUpRight } from "react-icons/go";

const DishCard = ({ dish, onClick }) => {
	return (
		<div className="dish" onClick={onClick} style={{ cursor: 'pointer' }}>
			<Image
				className="img-fluid"
				width={285}
				height={225}
				src={dish.image}
				alt="dish1"
			/>
			<div className="btn-group">
				<h3>{dish.title}</h3>
				<Link className="arrow" href="#" onClick={e => e.preventDefault()}>
					<GoArrowUpRight />
				</Link>
			</div>
		</div>
	);
};

export default DishCard; 