import { component$ } from '@builder.io/qwik';
import { Links } from './constants';

export default component$(() => {
	return (
		<>
			<nav
				class="navbar navbar-expand-lg navbar-dark fixed-top"
				id="mainNav"
			>
				<div class="container">
					<a class="navbar-brand js-scroll-trigger" href="#page-top">
						emerson.run
					</a>
					<button
						class="navbar-toggler navbar-toggler-right"
						type="button"
						data-toggle="collapse"
						data-target="#navbarResponsive"
						aria-controls="navbarResponsive"
						aria-expanded="false"
						aria-label="Toggle navigation"
					>
						Menu
						<i class="fas fa-bars"></i>
					</button>
					<div class="collapse navbar-collapse" id="navbarResponsive">
						<ul class="navbar-nav text-uppercase ml-auto"></ul>
					</div>
				</div>
			</nav>
			<header class="masthead">
				<div class="container">
					<div class="intro-text"></div>
				</div>
			</header>

			<section class="page-section" id="services">
				<div class="container">
					<div class="row">
						<div class="col-lg-12 text-center">
							<h2 class="section-heading text-uppercase">
								About
							</h2>
						</div>
						<div>TODO</div>
					</div>
					{Links.map((link) => {
						return (
							<div class="row" key={link.title}>
								<div class="col-lg-12 text-center">
									<h2 class="section-heading text-uppercase">
										{link.title}
									</h2>
								</div>
								<div class="col-lg-12 text-center">
									<a
										class="btn btn-primary btn-xl text-uppercase js-scroll-trigger"
										href={link.url}
									>
										{link.title}
									</a>
								</div>
							</div>
						);
					})}
					<div class="row text-center"></div>
				</div>
			</section>
			<footer class="footer" id="footer" style="background-color: white">
				<div class="container">
					<div class="row align-items-center">
						<div class="col-md-4">
							<span class="copyright">
								Copyright &copy; emerson.run{' '}
								{new Date().getFullYear()}
							</span>
						</div>

						<div class="col-md-4">
							<ul class="list-inline social-buttons"></ul>
						</div>

						<div class="col-md-4"></div>
					</div>
				</div>
			</footer>
		</>
	);
});
