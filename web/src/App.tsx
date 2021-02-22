import React, { useState } from 'react';
import './App.css';

import Header from './Header';

function App() {
  const [counter, setCounter] = useState(0);


  function handleButtonClick(){
    setCounter(counter + 1); //immutability concept
    console.log(counter);    
  }
  return (
         <div>
           <Header title={`Counter: ${counter}`}/>

           <h1>{counter}</h1>
           <h1>{counter^2}</h1>

           <button type="button" onClick={handleButtonClick}>Increase</button>                   
           <h1>App Content</h1>

         </div>
  );
}

export default App;
