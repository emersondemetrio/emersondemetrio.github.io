import 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import { Home } from './pages/home/home';
import Footer from './components/footer';
import Header from './components/header';

const About = () => {
	return (
		<section className="page-section">
			<h2>About</h2>
		</section>
	);
};

export const App = () => {
	return (
		<>
			<Header />
			<div className="content">
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/about" element={<About />} />
				</Routes>
			</div>
			<Footer />
		</>
	);
};
