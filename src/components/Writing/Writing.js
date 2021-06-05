import React, { useState, useEffect } from 'react';

const query = `
    {
      user(username: "heyosj") {
        publication {
          posts{
            slug
            title
            brief
            coverImage
          }
        }
      }
    }
  `;

const Banner = () => {
	return (
		<div className="mx-auto p-10 md:p-20 lg:px-52 bg-gray-100 mb-10 md:mb-0">
			<h1 className="tracking-widest text-3xl text-gray-700 font-black pt-5 pb-4 flex justify-between">
				My Writing
			</h1>
			<p className="mx-auto text-sm md:text-base lg:text1xl text-gray-500 ">
				I'm fairly new to writing but it's something I have wanted to do for a while. So here are some of my
				posts from Hashnode.
			</p>
		</div>
	);
};

const Post = ({ post }) => {
	return (
		<div className="container mx-auto pb-28 md:pb-10 lg:w-6/12 lg:pt-28">
			<div className="col-lg-7">
				<img className="shadow-2xl img-fluid rounded mb-4 mb-lg-0" src={post.coverImage} alt={post.title} />
			</div>
			<div className="my-2">
				<h2 className="mx-auto px-5 tracking-widest text-2xl text-gray-700 font-black pt-5">{post.title}</h2>
				<p className="mx-auto text-1xl text-gray-500 p-5">{post.brief}</p>
			</div>
		</div>
	);
};

const Writing = () => {
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		const fetchPosts = async () => {
			const response = await fetch('https://api.hashnode.com', {
				method: 'POST',
				headers: {
					'Content-type': 'application/json'
				},
				body: JSON.stringify({ query })
			});
			const ApiResponse = await response.json();
			setPosts(ApiResponse.data.user.publication.posts);

			console.log(ApiResponse.data.user.publication.posts);
		};
		fetchPosts();
	});

	return (
		<div>
			<Banner />
			{posts.map((post, index) => (
				<a key={index} href={`https://heyosj.hashnode.dev/${post.slug}`} target="_blank" rel="noreferrer">
					<Post post={post} />
				</a>
			))}
		</div>
	);
};

export default Writing;
// we can use hashnodes api to get most recent posts
