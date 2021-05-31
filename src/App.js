import './App.css';
import Navbar from './components/Navbar/Navbar';
import IntroImage from './components/IntroImage/IntroImage';
import About from './components/About/About';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';

function App() {
	return (
		<div className="App">
			<header className="App-header">
				<Navbar />
				<IntroImage />
				<About />
				<Contact />
				<Footer />
			</header>
		</div>
	);
}

export default App;
