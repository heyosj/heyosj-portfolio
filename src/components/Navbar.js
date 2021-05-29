import React from 'react';
import './Navbar.css';

const Navbar = () => {
	React.useEffect(() => {
		let hamburger = document.getElementById('hamburgerbtn');
		let mobileMenu = document.getElementById('mobileMenu');

		hamburger.addEventListener('click', function () {
			mobileMenu.classList.toggle('active');
		});
	});

	return (
		<div className="container mx-auto bg-gray-100 p-5">
			<nav className="flex-row md:justify-between">
				<div className="flex flex-row justify-between">
					<a href="#">OSJ</a>
					<p id="hamburgerbtn" className="md:hidden">
						-
					</p>
				</div>

				<ul className="hidden md:flex md:flex-row" id="mobileMenu">
					<li className="pr-5">
						<a> Services </a>
					</li>
					<li className="pr-5">
						<a>Porfolio</a>
					</li>
					<li className="pr-5">
						<a>About</a>
					</li>
					<li className="pr-5">
						<a>Contact</a>
					</li>
				</ul>
			</nav>
		</div>
	);
};

export default Navbar;
