import './App.css';
import { useState, useEffect } from 'react';
import data from './data';

const getBest = () => {
  const best = JSON.parse(localStorage.getItem('best'));
  if (best) {
    return best;
  }
  return 0;
}

function App() {
  const [lights, setLights] = useState(data);
  const [sequence, setSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [success, setSuccess] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [best, setBest] = useState(getBest());

  const turnOnLight = (index) => {
    const newLights = [...lights];
    newLights[index].on = true;
    setLights(newLights);
    setTimeout(() => {
      const newerLights = [...lights];
      newerLights[index].on = false;
      setLights(newerLights)
    }, getDelay());
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
    setLights(data);
    setShowGameOver(false);
    setGameStarted(true);
    setUserSequence([]);
    setSequence([]);
    initialSequence(3);
  }

  const getDelay = () => {
    let delay = 500;
    let speed = getSpeed();
    if (speed === 600) delay = 300;
    if (speed <= 400) delay = 200;
    if (speed === 200) delay = 100;
    if (speed <= 100) delay = 70;
    return delay;
  }

  const getSpeed = () => {
    let speed = 1000;
    if (sequence.length > 5) speed = 800;
    if (sequence.length > 7) speed = 600;
    if (sequence.length > 9) speed = 400;
    if (sequence.length > 11) speed = 300;
    if (sequence.length > 13) speed = 200;
    if (sequence.length > 15) speed = 100;

    return speed;
  }
 
  const specificSequence = (sequence, index) => {
    turnOnLight(sequence[index]);
    setTimeout(() => {
      specificSequence(sequence, index + 1);
    }, getSpeed())
  }

  const handleClick = (index) => {
    turnOnLight(index);
    setUserSequence(oldUserSequence => [...oldUserSequence, index]);
  }

  const handleSuccess = () => {
    setSequence(prevSequence => [...prevSequence, getRandomIndex()]);
    setUserSequence([]);
    setSuccess(true);
  }
  const handleFail = () => {
    setSequence([]);
    setUserSequence([]);
    setShowGameOver(true);
    setGameStarted(false);
    const score = sequence.length -1;
    if (score > best && score >= 3) {
      setBest(score);
      localStorage.setItem('best', JSON.stringify(score));
    }
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
      <div className='title-container'>
        <p className='title'>{showGameOver ? 'Game Over' : 'Sequencer'}</p>
        <div className='underline'></div>
      </div>
      <div className='container'>
        {lights.map((light, index) => {
          const {id, on, color} = light;
          return <div
            key={id}
            className={`light ${on ? color : ''}`}
            onClick={() => handleClick(index)}
          ></div>
        })}
        <button className='start-btn' onClick={() => startGame()}>{gameStarted ? 'Retry' : 'Start'}</button>
      </div>
      {best && <div className='best'>best: {best}</div>}
    </>
  );
}

export default App;
