import { HomeUrl } from '../../constants';

const Header = () => {
	return (
		<nav
			className="navbar navbar-expand-lg navbar-dark fixed-top"
			id="mainNav"
		>
			<div className="container">
				<a
					className="navbar-brand js-scroll-trigger"
					href={HomeUrl.url}
				>
					{HomeUrl.title}
				</a>
			</div>
		</nav>
	);
};

export default Header;
