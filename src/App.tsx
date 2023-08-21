import 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom'
import { Home } from './pages/home/home';

const About = () => {
	return (
		<section className="page-section">
			<h2>About</h2>
		</section>
	)
}

export const App = () => {
	return (
		<div>
			<nav
				className="navbar navbar-expand-lg navbar-dark fixed-top"
				id="mainNav"
			>
				<div className="container">
					<a
						className="navbar-brand js-scroll-trigger"
						href="#page-top"
					>
						emerson.run
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
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/about" element={<About />} />
			</Routes>
			<footer className="footer" id="footer">
				<div className="container">
					<div className="row align-items-center">
						<div className="col-md-4">
							<span className="copyright">
								Copyright &copy; <a href='https://emerson.run'>emerson.run</a> <span>{new Date().getFullYear()}</span>
							</span>
						</div>

						<div className="col-md-4">
							<ul className="list-inline social-buttons"></ul>
						</div>

						<div className="col-md-4"></div>
					</div>
				</div>
			</footer>
		</div>
	);
}
