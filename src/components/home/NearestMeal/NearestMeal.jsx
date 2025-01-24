import Image from "next/image";

const NearestMeal = () => {
	return (
		<section id="nearest-meal">
			<div className="container" data-aos="fade-up">
				<h1 className="title">
					Find Your <span>Nearest Meal</span> Hub
				</h1>
				<div className="description-wrapper">
					<p className="description">
						Locate our convenient Grab N Go Express containers near you
						using the map below. Fresh, chef-prepared meals are just a few
						steps away—24/7, no matter where you are!
					</p>
				</div>
				<div className="map">
					<Image
						className="img-fluid"
						src="/img/home/nearest-meal/map.svg"
						alt="Map"
						width={1200}
						height={600}
						layout="responsive"
					/>
				</div>
			</div>
		</section>
	);
};

export default NearestMeal;
