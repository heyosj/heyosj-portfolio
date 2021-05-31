import React from 'react';
import { SocialIcon } from 'react-social-icons';

const Contact = () => {
	return (
		<div className="container mx-auto p-10 lg:w-6/12 lg:pt-28 lg:pt-0">
			<h1 className="tracking-widest text-2xl text-gray-700 font-black pt-5 pb-4 flex justify-between">
				Contact Me
			</h1>
			<div className="">
				<span className="pr-2 cursor-pointer" target="_blank">
					<SocialIcon url="https://www.linkedin.com/in/osanchezjr" network="linkedin" target="_blank" />
				</span>
				<span className="pr-2 cursor-pointer">
					<SocialIcon url="https://www.twitter.com/heyosj" network="twitter" target="_blank" />
				</span>
				<span className="pr-2 cursor-pointer">
					<SocialIcon url="https://wwww.github.com/heyosj" network="github" target="_blank" />
				</span>
				<span className="pr-2 cursor-pointer">
					<SocialIcon url={'mailto:ojsanch@gmail.com'} network="email" target="_blank" />
				</span>
			</div>
		</div>
	);
};

export default Contact;
