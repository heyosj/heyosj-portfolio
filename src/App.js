import './App.css';
import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import Footer from './components/Footer/Footer';

import Projects from './components/Projects/Projects';
import Writing from './components/Writing/Writing';
import { BrowserRouter as Router, Route } from 'react-router-dom';

function App() {
	return (
		<Router>
			<div className="App">
				<Navbar />
				<Route exact path="/" component={Home} />
				<Route path="/projects" component={Projects} />
				<Route path="/writing" component={Writing} />
				<Footer />
			</div>
		</Router>
	);
}

export default App;
