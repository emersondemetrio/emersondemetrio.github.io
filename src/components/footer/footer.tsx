import React from 'react';

const Footer = () => {
	return (
		<footer className="footer" id="footer">
			<div className="container">
				<div className="row align-items-center">
					<div className="col-md-4">
						<span className="copyright">
							Copyright &copy;{' '}
							<a href="https://emerson.run">emerson.run</a>{' '}
							<span>{new Date().getFullYear()}</span>
						</span>
					</div>

					<div className="col-md-4">
						<ul className="list-inline social-buttons"></ul>
					</div>

					<div className="col-md-4"></div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
