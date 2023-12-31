import { HomeUrl } from '../../constants';

const Footer = () => {
	return (
		<footer className="footer" id="footer">
			<div className="col-md-4">
				<p className="copyright">
					Copyright &copy; <a href={HomeUrl.url}>{HomeUrl.title}</a>{' '}
					<span>{new Date().getFullYear()}</span>
				</p>
			</div>
		</footer>
	);
};

export default Footer;
