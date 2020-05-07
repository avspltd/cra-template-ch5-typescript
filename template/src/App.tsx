import React, { TouchEvent } from 'react';
import { useSubscribeString, usePublishAnalog, useSubscribeAnalog } from 'react-ch5';
import logo from './assets/logo.svg';
import avsp from './assets/avsp.png';
import './App.css';
import PushButton from './components/PushButton';

// TODO set this to your machine name or IP address on the same network as the panel to see live updating version via the "navigate there" link
// if this is set to your dev machine, when you run "yarn start", then click the "navigate there" link on the panel, you will have live hot-module-reload
const devMachine = "my-laptop";

const InterlockedButtons = () => (
  <>
    Interlocked:
    <PushButton publishSignalName="21" subscribeSignalName="21" >A</PushButton>
    <PushButton publishSignalName="22" subscribeSignalName="22" >B</PushButton>
    <PushButton publishSignalName="23" subscribeSignalName="23" >C</PushButton>
    <PushButton publishSignalName="24" subscribeSignalName="24" >D</PushButton>
  </>
)

const ToggleButtons = () => (
  <>
    Toggles:
    <PushButton publishSignalName="31" subscribeSignalName="31" >1</PushButton>
    <PushButton publishSignalName="32" subscribeSignalName="32" >2</PushButton>
  </>
)

type StringDivProps = {
  stringsubscribeSignalName: string,
}

const StringDiv: React.FunctionComponent<StringDivProps> = (props) => {
  const value = useSubscribeString(props.stringsubscribeSignalName);

  return <div style={{ margin: '0 1rem', display: "flex", justifyContent: 'center', alignItems: 'center', border: '5px solid black', width: '20rem', height: '4rem', backgroundColor: '#aaa' }}>{value}</div>;
}

type AnalogDivProps = {
  analogSendSignalName: string,
  analogsubscribeSignalName: string,
}

function clamp(value: number, min: number, max: number) {
  if (value < min)
    return min;
  else if (value > max)
    return max;

  return value;
}

const AnalogDiv: React.FunctionComponent<AnalogDivProps> = (props) => {
  const publish = usePublishAnalog(props.analogSendSignalName);
  const value = useSubscribeAnalog(props.analogsubscribeSignalName);
  const divref = React.useRef<HTMLDivElement>(null);

  const percent = value * 100 / 65535;

  const percentString = percent + '%';

  const touch = (event:TouchEvent<HTMLDivElement>) => {
    if (divref.current) {
      const clientRect = divref.current.getBoundingClientRect();
      const width = clientRect.right - clientRect.left;

      for (var i = 0; i < event.changedTouches.length; i++) {
        const value = clamp(Math.round(65535 * (event.changedTouches[i].pageX - clientRect.left) / width), 0, 65535);
        publish(value);
        console.log(value);
      }
    }
  }

  return (
    <div ref={divref} onTouchStart={touch} onTouchMove={touch} style={{ margin: '0 1rem', border: '1px solid black', display: 'inline-block', width: '20rem', height: '4rem', backgroundColor: '#aaa' }}> 
      <div style={{backgroundColor: '#2f2', width: percentString, height: '4rem'}}></div>
    </div>
  );
}

const Container: React.FunctionComponent = (props) => (
  <div className="App-container">
    {props.children}
  </div>
)

const VolumeControl = () => (
  <>
    Volume:
    <PushButton publishSignalName="35" subscribeSignalName="35" >-</PushButton>
    <AnalogDiv analogSendSignalName="21" analogsubscribeSignalName="21" />
    <PushButton publishSignalName="34" subscribeSignalName="34" >+</PushButton>
  </>
)


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="App-wrap-logo">
          <img src={logo} className="App-logo" alt="react logo" />
          <img src={avsp} className="App-logo" alt="avsp logo" />
        </div>
        <div>
          <p>
            Configure your development machine's address in the top of <code>App.tsx</code>, it is currently set to <code>{devMachine}</code><br />
            Use <code>yarn start</code> then <a href={"http://" + devMachine + ":3000/"}>navigate there</a> to see live updates<br />
            Edit <code>src/App.tsx</code> and save to reload
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </div>
        <div>
          <Container><InterlockedButtons /><StringDiv stringsubscribeSignalName="21" /></Container>
          <Container><ToggleButtons /></Container>
          <Container><VolumeControl /></Container>
        </div>
      </header>
      <footer>
        {window.location.href /* this way, we can see whether we are looking at internal panel url or live dev server*/}
      </footer>
    </div>
  );
}

export default App;
