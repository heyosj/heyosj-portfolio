import './App.css';
import Navbar from './components/Navbar/Navbar';
import IntroImage from './components/IntroImage/IntroImage';

function App() {
	return (
		<div className="App">
			<header className="App-header">
				<Navbar />
				<IntroImage />
			</header>
		</div>
	);
}

export default App;
