import React from 'react';

function Projects(props) {
	return (
		<div className="about">
			<div class="col-lg-7">
				<img class="img-fluid rounded mb-4 mb-lg-0" src={props.image} alt="" />
			</div>
			<h1 className="mx-auto px-5 tracking-widest text-3xl text-gray-700 font-black pt-5">{props.name}</h1>
			<p className="mx-auto text-1xl text-gray-500 px-5">{props.description}</p>
			<ul>
				<li>
					<a href={props.githubLink} target="_blank" rel="noreferrer">
						Code
					</a>
				</li>
				<li>
					<a href={props.liveSite} target="_blank" rel="noreferrer">
						Live
					</a>
				</li>
			</ul>
		</div>
	);
}

export default Projects;

// this should be a component, that passes the Image, the stack and the description as props
// <Project img={/project.jpg} techStack={react, tailwindcss} desc={a simple portfolio done with react.js and tailwind.css, here i learned about routing for the first time}
// that way we can add projects as they come:
{
	/* <Project img={proj1}/>
	<Project img={proj2}/>
	<Project img={proj3}/>
	<Project img={proj4}/> */
}
