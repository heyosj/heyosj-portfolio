import React from 'react';
import './Navbar.css';
import { MenuIcon } from '@heroicons/react/solid';

const Navbar = () => {
	React.useEffect(() => {
		let hamburger = document.getElementById('hamburgerbtn');
		let mobileMenu = document.getElementById('mobileMenu');

		hamburger.addEventListener('click', function () {
			mobileMenu.classList.toggle('active');
		});
	});

	return (
		<div className="container mx-auto p-5">
			<nav className="flex-row md:justify-between">
				<div className="flex flex-row justify-between">
					<a href="#" className="h-5 w-5 tracking-wide font-semibold">
						OSJ
					</a>
					<p id="hamburgerbtn" className="md:hidden">
						<MenuIcon className="h-5 w-5 text-gray" />
					</p>
				</div>

				<ul className="hidden md:flex md:flex-row text-center" id="mobileMenu">
					<li className="pr-5 py-2">
						<a>Services</a>
					</li>
					<li className="pr-5 py-2">
						<a>Porfolio</a>
					</li>
					<li className="pr-5 py-2">
						<a>About</a>
					</li>
					<li className="pr-5 py-2">
						<a>Contact</a>
					</li>
				</ul>
			</nav>
		</div>
	);
};

export default Navbar;
