import React from 'react';
import Projects from '../Projects/Projects';
import minifileImage from '../../imgs/minifile.png';
import extremeImage from '../../imgs/extreme.png';

const ProjectsContainer = (props) => {
	return (
		<div class="container mx-auto">
			<div class="flex items-center my-10">
				<div class="col-lg-5">
					<div className="p-5 bg-gray-100">
						<h1 className="mx-auto px-5 bg-gray-100 tracking-widest text-3xl text-gray-700 font-black pt-5">
							projects
						</h1>
						<p className="mx-auto text-1xl text-gray-500 p-5">
							most of my work is public and can be found on my
							<span>
								<a
									className="cursor-pointer border-b-2 border-indigo-600 inline-block px-1"
									href="https://www.github.com/heyosj"
									target="_blank"
									rel="noreferrer"
								>
									Github
								</a>
							</span>
						</p>
					</div>
					<h1 class="font-weight-light mt-5">
						<Projects
							name="minifile"
							description="a way to minify your projects"
							image={minifileImage}
							githubLink="http://github.com/heyosj/minifile"
							liveSite="http://heyosj.github.io/minifile"
						/>
						<Projects
							name="extremeVPN"
							description="vpn service built with React"
							image={extremeImage}
							githubLink="http://github.com/heyosj/extremeVPN"
							liveSite="http://extremevpn.netlify.com"
						/>
					</h1>
				</div>
			</div>
		</div>
	);
};

export default ProjectsContainer;
