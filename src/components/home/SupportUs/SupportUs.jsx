import Link from "next/link";

const SupportUs = () => {
	return (
		<section id="support-us">
			<div className="section-wrapper" data-aos="fade-up">
				<div className="container">
					<h1 className="title">Let’s Grab the Future Together!</h1>
					<p className="description">
						Every contribution, big or small, brings us one step closer to
						making Grab N Go Express a reality in your city. Join us in
						creating a smarter, fresher, and faster food experience for
						everyone.
					</p>
					<Link className="btn" href="#">
						Support Us on IndieGoGo
					</Link>
				</div>
			</div>
		</section>
	);
};

export default SupportUs;
