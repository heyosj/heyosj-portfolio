import './App.css';
import Navbar from './components/Navbar/Navbar';
import IntroImage from './components/IntroImage/IntroImage';
import About from './components/About/About';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Projects from './components/Projects/Projects';

function App() {
	return (
		<div className="App">
			<header className="App-header">
				<Router>
					<Navbar />
					<Switch>
						<Route path="/" exact component={() => <Projects />} />
					</Switch>
				</Router>
				<IntroImage />
				<About />
				<Contact />
				<Footer />
			</header>
		</div>
	);
}

export default App;
