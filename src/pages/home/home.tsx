import 'react';
import { Link, Links } from '../../constants';
import './home.css';

const CustomLink = ({ title, url }: Link) => {
	return (
		<a
			href={url}
			key={title}
			target="_blank"
			className="grid-item text-uppercase"
		>
			<div key={title}>{title}</div>
		</a>
	);
};

export const Home = () => {
	return (
		<>
			<section className="page-section" id="services">
				<div className="container">
					<div className="row">
						<div
							className="col-lg-12 text-center"
							style={{
								marginBottom: 20,
							}}
						>
							<h3 className="section-heading text-primary black-bg">
								Emerson Demetrio
							</h3>
							<p className="text-primary black-bg">
								I Drink and I know things
							</p>
						</div>
					</div>
					<div className="grid-container">
						{Links.map(({ title, url }) => (
							<CustomLink key={title} title={title} url={url} />
						))}
					</div>
				</div>
			</section>
		</>
	);
};
