import './App.css';
import Navbar from './components/Navbar/Navbar';
import IntroImage from './components/IntroImage/IntroImage';
import About from './components/About/About';
import Contact from './components/Contact/Contact';

function App() {
	return (
		<div className="App">
			<header className="App-header">
				<Navbar />
				<IntroImage />
				<About />
				<Contact />
			</header>
		</div>
	);
}

export default App;
