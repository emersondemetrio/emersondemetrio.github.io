import 'react';

import { Links } from '../../constants';

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
					{Links.map((link) => {
						return (
							<div
								className="row"
								key={link.title}
								style={{
									marginBottom: 10,
								}}
							>
								<div className="col-lg-12 text-center">
									<a
										style={{
											marginBottom: 10,
											width: 200,
										}}
										className="btn btn-light btn-outline-secondary btn-xl text-uppercase"
										href={link.url}
										target="_blank"
									>
										{link.title}
									</a>
								</div>
							</div>
						);
					})}
					<div className="row text-center"></div>
				</div>
			</section>
		</>
	);
};
