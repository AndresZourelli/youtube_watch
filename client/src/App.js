import React, { Component } from 'react';
import './App.css';
import  Home  from './components/home/home';
import VideoQueue from './components/VideoQueue/VideoQueue'
import { Navbar } from './components/navbar/navbar';
class App extends Component {
  render() {
    return (
      <div className="App">
        <Navbar />
        <Home />
       
        
      </div>
    );
  }
}

export default App;
