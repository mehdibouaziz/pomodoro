import React from 'react';
import './App.css';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      breakLength: 5,
      sessionLength: 25,
      secLeft: 1500,
      timerLabel: 'Session',
      status: 'stopped'
    }

    this.handleSetting = this.handleSetting.bind(this);
    this.handleStart = this.handleStart.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.secToMinSec = this.secToMinSec.bind(this);
    this.startClock = this.startClock.bind(this);
    this.stopClock = this.stopClock.bind(this);
    this.tick = this.tick.bind(this);
    this.timeOut = this.timeOut.bind(this);

  }

  handleSetting(e) {

    if(this.state.status==='running'){return;}
    
    switch(e.target.id) {
      case 'break-decrement':
        if (this.state.breakLength!==1) {
        this.setState({
          breakLength: this.state.breakLength-1
        });}
        break;
      case 'break-increment':
        if (this.state.breakLength!==60) {
        this.setState({
          breakLength: this.state.breakLength+1
        });}
        break;
      case 'session-decrement':
        if (this.state.sessionLength!==1) {
        this.setState({
          sessionLength: this.state.sessionLength-1,
          secLeft: (this.state.sessionLength-1)*60
        });}
        break;
      case 'session-increment':
        if (this.state.sessionLength!==60) {
        this.setState({
          sessionLength: this.state.sessionLength+1,
          secLeft: (this.state.sessionLength+1)*60
        });}
        break;
      default:
        break;
    };
  }
  handleStart() {
    switch(this.state.status) {
      case 'stopped':
      case 'paused':
        this.setState({
          status: 'running'
        })
        this.startClock();
        break;
      case 'running':
        this.setState({
          status: 'paused'
        })
        this.stopClock();
        break;
      default:
        break;
    }
  }

  handleReset() {
    this.stopClock();
    this.setState({
      breakLength: 5,
      sessionLength: 25,
      secLeft: 1500,
      timerLabel: 'Session',
      status: 'stopped'
    });
    document.getElementById('beep').pause();
    document.getElementById('beep').currentTime = 0;
  }

  secToMinSec(int) {
    if(int<0){return('00:00')};
    let min = Math.floor(int/60).toString().padStart(2, '0');
    let sec = (int%60).toString().padStart(2, '0');
    return(min+':'+sec);
  }

  startClock() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  stopClock() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      secLeft: this.state.secLeft-1
    });
    if(this.state.secLeft<0){
      this.timeOut()
    };
  }

  timeOut(){
    /* 1. buzzer  2. stop clock   3. switch phase and reset timer  4.startclock */
    document.getElementById('beep').play();
    this.stopClock();
    if(this.state.timerLabel==='Session'){
      this.setState({
        timerLabel: 'Break',
        secLeft: this.state.breakLength*60
      });
    } else {
      this.setState({
        timerLabel: 'Session',
        secLeft: this.state.sessionLength*60
      });
    };
    this.startClock();
  }



  render() {
    return (
      <div className="App flex-col">
        
        <div className='' id='title'>
          Pomodoro Clock
        </div>
  

        <div className='' id='settings'>

          <div id='settings-break'>
            <p id='break-label'>Break Length</p>
            <div className='flex-row'>
              <button onClick={this.handleSetting} id='break-decrement'>-</button>
              <p id='break-length'>{this.state.breakLength}</p>
              <button onClick={this.handleSetting} id='break-increment'>+</button>
            </div>
          </div>
  
          <div id='settings-session'>
            <p id='session-label'>Session Length</p>
            <div className='flex-row'>
              <button onClick={this.handleSetting} id='session-decrement'>-</button>
              <p id='session-length'>{this.state.sessionLength}</p>
              <button onClick={this.handleSetting} id='session-increment'>+</button>
            </div>
          </div>

        </div>
  

        <div className='' id='timer'>
          <p id='timer-label'>{this.state.timerLabel}</p>
          <p id='time-left'>{this.secToMinSec(this.state.secLeft)}</p>
        </div>
  

        <div className='' id='controls'>
          <button onClick={this.handleStart} id='start_stop'><i className="fas fa-play"></i><i className="fas fa-pause"></i></button>
          <button onClick={this.handleReset} id='reset'><i class="fas fa-undo"></i></button>
          <audio id='beep' preload='auto' src='https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav' />
          <p>Status: {this.state.status}</p>
        </div>
  
      </div>
    );
  }
}

export default App;
