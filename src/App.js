import logo from './logo.svg';
import './App.css';
import Main from './components/main';
import Header from './components/Header';

function App() {
  return (
    <div className="App">

      <header className="App-header">
      <Header/>
     
      </header>
      <Main/>
    </div>
  );
}

export default App;
