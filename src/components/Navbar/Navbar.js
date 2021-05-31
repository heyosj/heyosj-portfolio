import React from 'react';
import './Navbar.css';
import { MenuIcon } from '@heroicons/react/solid';
import Projects from '../Projects/Projects';

const Navbar = ({ fixed }) => {
	const [navbarOpen, setNavbarOpen] = React.useState(false);
	return (
		<div className="container mx-auto">
			<nav className="relative flex flex-wrap items-center justify-between px-2 py-1 bg-blueGray-500 mb-1 text-center">
				<div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
					<div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
						<a
							className="text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase text-gray-800"
							href="#pablo"
						>
							OSJ
						</a>
						<button
							className="text-black cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
							type="button"
							onClick={() => setNavbarOpen(!navbarOpen)}
						>
							<MenuIcon className="h-5 w-5 text-gray" />
						</button>
					</div>
					<div
						className={'lg:flex flex-grow items-center' + (navbarOpen ? ' flex' : ' hidden')}
						id="example-navbar-danger"
					>
						<ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
							<li className="nav-item">
								<a
									className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-gray-800 hover:opacity-75"
									href="#pablo"
								>
									<span className="ml-2">Writing</span>
								</a>
							</li>
							<li className="nav-item">
								<a
									className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-gray-800 hover:opacity-75"
									href="/projects"
								>
									<span className="ml-2">Projects</span>
								</a>
							</li>
						</ul>
					</div>
				</div>
			</nav>
		</div>
	);
};
export default Navbar;
