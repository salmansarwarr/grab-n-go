import Image from "next/image";

const IndieGoGo = () => {
	return (
		<section id="indiegogo">
			<div className="container">
				<div className="section-wrapper">
					<div className="contents" data-aos="fade-up">
						<h1 className="title">
							Support Grab N Go Express on <span>IndieGoGo!</span>
						</h1>
						<p className="green-text">
							Fuel the Future of Fast & Fresh Convenience
						</p>
						<p className="description">
							Grab N Go Express is on a mission to revolutionize how you
							experience quick, quality meals on the go. We’re combining
							innovation and convenience to bring you fresh, delicious
							food options without the wait. But we can’t do it without
							you!
						</p>
						<div className="points">
							<p className="point-title">Your support can help us:</p>
							<ul>
								<li>
									<span className="point-dot"></span>
									<span>
										Launch more Grab N Go locations in high-demand
										areas.
									</span>
								</li>
								<li>
									<span className="point-dot"></span>
									<span>
										Introduce cutting-edge technology for faster
										service.
									</span>
								</li>
								<li>
									<span className="point-dot"></span>
									<span>
										Create a sustainable and eco-friendly food service
										model.
									</span>
								</li>
							</ul>
						</div>
					</div>
					<div className="image">
						<Image
							className="img-fluid"
							src="/img/home/indiegogo/dish.webp"
							alt="IndieGoGo"
							width={576}
							height={508}
						/>
					</div>
				</div>
			</div>
		</section>
	);
};

export default IndieGoGo;
