import React from 'react';
import Projects from '../Projects/Projects';
import minifileImage from '../../imgs/minifile.png';
import extremeImage from '../../imgs/extreme.png';

const ProjectsContainer = () => {
	return (
		<div class="mx-auto">
			<div class="mx-auto bg-gray-100 lg:pl-40">
				<div class="mx-auto p-20 bg-gray-100 mb-10 md:mb-0">
					<div className="container mx-auto">
						<h1 className="tracking-widest text-3xl text-gray-700 font-black pt-5 pb-4 flex justify-between">
							projects
						</h1>
						<p className="mx-auto text-sm md:text-base lg:text1xl text-gray-500 ">
							I love to write code and learn new things. So you can see that most of my work is public and
							can be found on my
							<span>
								<a
									className="cursor-pointer border-b-2 border-indigo-600 px-1"
									href="https://www.github.com/heyosj"
									target="_blank"
									rel="noreferrer"
								>
									Github
								</a>
							</span>
							there you can see all the various languages that I mess around with, frameworks that I want
							to learn and projects I put together in the process of learning new things. Below are some
							of my featured products, these projects excite me and I could talk about them all day. I
							hope you enjoy them too. I will be adding to this constantly so check back for more.
						</p>
					</div>
				</div>
			</div>
			<div class="container mx-auto">
				<div class="flex items-center my-2"></div>
				<h1 className="font-weight-light">
					<Projects
						name="minifile"
						description="minifile is a NodeJS CLI tool used to reduce whitespace and comments in production code. I made this tool due to being tired of copying my CSS or JavaScript and getting it minified. This tool will run once the path has been specified and output a 'min' folder. There you will find a minified version of the original code with a .min extension"
						image={minifileImage}
						githubLink="http://github.com/heyosj/minifile"
						liveSite="http://heyosj.github.io/minifile"
					/>
					<Projects
						name="extremeVPN"
						description="extremeVPN was made as a intense version of a VPN provider. This was a practice for learning ReactJS. You can find more details about the learning experience I had at the repository. There you will find my design planning as well."
						image={extremeImage}
						githubLink="http://github.com/heyosj/extremeVPN"
						liveSite="http://extremevpn.netlify.com"
					/>
				</h1>
			</div>
		</div>
	);
};

export default ProjectsContainer;
