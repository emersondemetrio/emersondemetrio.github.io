import 'react';
import { Links } from '../../constants';
import './home.css';

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
							<h3 className="section-heading text-primary">
								Emerson Demetrio
							</h3>
							<p className="text-primary">
								I Drink and I know things
							</p>
						</div>
					</div>
					<div className="grid-container">
						{Links.map(({ title, url }) => (
							<a
								href={url}
								key={title}
								target="_blank"
								className="grid-item text-uppercase"
							>
								<div key={title}>{title}</div>
							</a>
						))}
					</div>
				</div>
			</section>
		</>
	);
};
