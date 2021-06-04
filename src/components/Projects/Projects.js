import React from 'react';

function Projects(props) {
	return (
		<div className="container mx-auto pb-28 md:pb-10 lg:w-6/12 lg:pt-28">
			<div class="col-lg-7">
				<img class="shadow-2xl img-fluid rounded mb-4 mb-lg-0" src={props.image} alt="" />
			</div>
			<h1 className="mx-auto px-5 tracking-widest text-3xl text-gray-700 font-black pt-5">{props.name}</h1>
			<p className="mx-auto text-1xl text-gray-500 px-5">{props.description}</p>
			<ul className="flex justify-evenly p-3 cursor-pointer text-gray-500 text-1xl lowercase tracking-wide">
				<li className="border-2 py-2 px-5 rounded">
					<a href={props.githubLink} target="_blank" rel="noreferrer">
						Code
					</a>
				</li>
				<li className="border-2 py-2 px-5 rounded">
					<a href={props.liveSite} target="_blank" rel="noreferrer">
						Live
					</a>
				</li>
			</ul>
		</div>
	);
}

export default Projects;
