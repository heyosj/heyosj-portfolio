import React from 'react';
import ImageOfMe from '../../imgs/me.jpg';

const IntroImage = () => {
	return (
		<div className="container mx-auto p-20 text-center bg-gray-100">
			<div>
				<img
					src={ImageOfMe}
					alt="me.jpg"
					className="w-40 h-auto rounded-full mx-auto border-red-500 border-4"
				/>
				<h1 className="tracking-widest text-3xl text-gray-700 font-black pt-5">Oscar Sanchez Jr.</h1>
				<h4 className="text-1xl text-gray-500 pt-2">Software Engineer based out of Chicago Illinois</h4>
			</div>
		</div>
	);
};

export default IntroImage;
