import Image from "next/image";

const WhySupportUs = () => {
	return (
		<section id="why-support-us">
			<div className="content-wrapper">
				<div className="container" data-aos="fade-up">
					<div className="row">
						<div className="left-col">
							<Image
								src="/img/home/why-support-us/dish.svg"
								alt="why-support-us"
								width={576}
								height={676}
							/>
						</div>
						<div className="right-col">
							<div className="points">
								<p className="point-title">Why Support Us?</p>
								<ul>
									<li>
										<span className="point-dot"></span>
										<span>
											Fresh & Fast: Say goodbye to boring, unhealthy
											options. We deliver quality meals, quickly.
										</span>
									</li>
									<li>
										<span className="point-dot"></span>
										<span>
											Innovative Tech: Simplified ordering, reduced
											wait times, and better experiences for busy
											lifestyles.
										</span>
									</li>
									<li>
										<span className="point-dot"></span>
										<span>
											Be Part of the Change: Your contribution helps
											us redefine convenience for everyone!
										</span>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default WhySupportUs;
