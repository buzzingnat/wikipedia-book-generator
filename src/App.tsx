import React from 'react';
import logo from './logo.svg';
import { Counter } from './features/counter/Counter';
import { Search } from './features/search/Search';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Wikipedia Book Generator</h1>
        <Search />
        <h2>Example Feature -- why is this broken?</h2>
        <Counter />
      </header>
    </div>
  );
}

export default App;
