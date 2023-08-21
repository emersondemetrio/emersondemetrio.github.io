import 'react';
import './App.css';
import { Links } from './constants';

function App() {
	return (
		<>
			<nav
				className="navbar navbar-expand-lg navbar-dark fixed-top"
				id="mainNav"
			>
				<div className="container">
					<a
						className="navbar-brand js-scroll-trigger"
						href="#page-top"
					>
						home
					</a>
					<button
						className="navbar-toggler navbar-toggler-right"
						type="button"
						data-toggle="collapse"
						data-target="#navbarResponsive"
						aria-controls="navbarResponsive"
						aria-expanded="false"
						aria-label="Toggle navigation"
					>
						Menu
						<i className="fas fa-bars"></i>
					</button>
					<div
						className="collapse navbar-collapse"
						id="navbarResponsive"
					>
						<ul className="navbar-nav text-uppercase ml-auto"></ul>
					</div>
				</div>
			</nav>
			<header className="masthead">
				<div className="container">
					<div className="intro-text"></div>
				</div>
			</header>

			<section className="page-section" id="services">
				<div className="container">
					<div className="row">
						<div className="col-lg-12 text-center">
							<h2 className="section-heading text-uppercase">
								About
							</h2>
						</div>
						<div>TODO</div>
					</div>
					{Links.map((link) => {
						return (
							<div className="row" key={link.title}>
								<div className="col-lg-12 text-center">
									<h2 className="section-heading text-uppercase">
										{link.title}
									</h2>
								</div>
								<div className="col-lg-12 text-center">
									<a
										className="btn btn-primary btn-xl text-uppercase js-scroll-trigger"
										href={link.url}
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
			<footer className="footer" id="footer">
				<div className="container">
					<div className="row align-items-center">
						<div className="col-md-4">
							<span className="copyright">
								Copyright &copy; emerson.run{' '}
								{new Date().getFullYear()}
							</span>
						</div>

						<div className="col-md-4">
							<ul className="list-inline social-buttons"></ul>
						</div>

						<div className="col-md-4"></div>
					</div>
				</div>
			</footer>
		</>
	);
}

export default App;
