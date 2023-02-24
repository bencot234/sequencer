import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const [lights, setLights] = useState([
    { id: 0, on: false, color: "red" },
    { id: 1, on: false, color: "blue" },
    { id: 2, on: false, color: "green" },
    { id: 3, on: false, color: "yellow" },
  ]);
  const [sequence, setSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [numLights, setNumLights] = useState(3);
  const [success, setSuccess] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);

  const turnOnLight = (index, speed = 500) => {
    let delay = 500;
    if (speed < 500) {
      delay = 300;
    }
    const newLights = [...lights];
    newLights[index].on = true;
    setLights(newLights);
    setTimeout(() => {
      const newerLights = [...lights];
      newerLights[index].on = false;
      setLights(newerLights)
    }, delay);
  }

  const getRandomIndex = () => {
    return Math.ceil(Math.random() * lights.length -1);
  }

  const initialSequence = (repeat) => {
    if(repeat === 0) {
      return;
    }
    setSuccess(false);

    const nextLightIndex = getRandomIndex()
    turnOnLight(nextLightIndex);
    setSequence(oldSequence => [...oldSequence, nextLightIndex]);
    setTimeout(() => {
      initialSequence(repeat -1)
    }, 1000);    
  }

  const startGame = () => {
    setShowGameOver(false);
    initialSequence(numLights)
  }
 
  const specificSequence = (sequence, index) => {

    let speed = 1000;
    if (sequence.length > 5) speed = 800;
    if (sequence.length > 7) speed = 600;
    if (sequence.length > 9) speed = 400;
    if (sequence.length > 11) speed = 300;
    if (sequence.length > 13) speed = 200;
    if (sequence.length > 15) speed = 100;
    turnOnLight(sequence[index], speed);
    setTimeout(() => {
      specificSequence(sequence, index + 1);
    }, speed)
  }


  const handleClick = (index) => {
    turnOnLight(index);
    setUserSequence(oldUserSequence => [...oldUserSequence, index]);
  }

  const handleSuccess = () => {
    console.log('yes');
    // setNumLights(prevNumLights => prevNumLights + 1);
    setSequence(prevSequence => [...prevSequence, getRandomIndex()]);
    setUserSequence([]);
    setSuccess(true);
  }
  const handleFail = () => {
    console.log('no');
    setSequence([]);
    setUserSequence([]);
    setShowGameOver(true);
  }

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        specificSequence(sequence, 0)
      }, 1000)
      setSuccess(false);
    }
  }, [success])
 
  useEffect(() => {
    if (sequence.length > 0 && userSequence.length === sequence.length) {
      const isEqual = sequence.every((value, index) => value === userSequence[index]);
      if (isEqual) {
        handleSuccess();
      } else {
        handleFail();
      }
    }
  }, [userSequence, sequence]);



  return (
    <>
      <p>Sequencer</p>
      <p className={`${showGameOver ? 'game-over' : 'hide'}`}>Game Over</p>
      <div className='container'>
        {lights.map((light, index) => {
          const {id, on, color} = light;
          return <div
            key={id}
            className={`light ${on ? color : ''}`}
            onClick={() => handleClick(index)}
          ></div>
        })}
        <button onClick={() => startGame()}>start</button>
      </div>
    </>
  );
}

export default App;
