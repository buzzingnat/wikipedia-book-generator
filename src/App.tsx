import React from 'react';
import logo from './logo.svg';
// import { Counter } from './features/counter/Counter';
import { Article } from './features/article/Article';
import { Search } from './features/search/Search';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Wikipedia Book Generator</h1>
        <Search />
      </header>
      <Article />
    </div>
  );
}

export default App;
