import React from 'react';
import './App.css';
import ProgressBar from './components/ProgressBar';



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
    this.calcProgress = this.calcProgress.bind(this);
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
      status: 'stopped',
      progress : 0
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

  calcProgress(int) {
    if(this.state.timerLabel === 'Session') {
      return ( Math.round((this.state.sessionLength*60 - int) / (this.state.sessionLength*60) *10000)/100 );
    } else if (this.state.timerLabel === 'Break') {
      return ( Math.round((this.state.breakLength*60 - int) / (this.state.breakLength*60) *10000)/100 );
    } else {
      return 0;
    };
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
    let left = this.state.secLeft-1
    this.setState({
      secLeft: left
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
          <h1>Pomodoro Clock</h1>
        </div>

        <ProgressBar 
          label={this.state.timerLabel}
          time={this.secToMinSec(this.state.secLeft)}
          progress={this.calcProgress(this.state.secLeft)}
          size={Math.min(document.documentElement.clientWidth*0.8, 250)}
          strokeWidth={6}
          circleOneStroke={this.state.timerLabel==='Break' ? '#0ca6df' : '#df450c'}
          circleTwoStroke='#505a6a'
        />

        {/* FOR CODEPEN */}
        {/*
          <div className='clock flex-col' style={{gap: 10}}>
          <div style={{margin: 0}}>
                <text id='timer-label' className="svg-circle-text">
                      {this.state.timerLabel}
                </text>
            </div>
            <div style={{margin: 0}}>
                <text id='time-left' className="svg-circle-text" style={this.state.timerLabel==='Break' ? {color: "#0ca6df"} : {color: "#df450c"}}>
                      {this.secToMinSec(this.state.secLeft)}
                </text>
            </div>
            </div>
        */}
  

        <div className='flex-row' id='controls'>
          <div className='clock-control' onClick={this.handleStart} id='start_stop'>{this.state.status==='running' ? <i class="fas fa-pause-circle fa-2x"></i> : <i class="fas fa-play-circle fa-2x"></i>}</div>
          <div className='clock-control' onClick={this.handleReset} id='reset'><i class="fas fa-times-circle fa-2x"></i></div>
          <audio id='beep' preload='auto' src='https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav' />
        </div>

        <div className='flex-row' id='settings'>

          <div className='flex-col setting-box' id='settings-break'>
            <p className='setting-label' id='break-label'>Break Length</p>
            <div className='flex-row setting-dial'>
              <i className='setting-button' onClick={this.handleSetting} id='break-decrement' class="fas fa-minus-circle fa-lg"></i>
              <p className='setting-value' id='break-length'>{this.state.breakLength}</p>
              <i className='setting-button' onClick={this.handleSetting} id='break-increment' class="fas fa-plus-circle fa-lg"></i>
            </div>
          </div>
  
          <div className='flex-col setting-box' id='settings-session'>
            <p className='setting-label' id='session-label'>Session Length</p>
            <div className='flex-row setting-dial'>
              <i className='setting-button' onClick={this.handleSetting} id='session-decrement' class="fas fa-minus-circle fa-lg"></i>
              <p className='setting-value' id='session-length'>{this.state.sessionLength}</p>
              <i className='setting-button' onClick={this.handleSetting} id='session-increment' class="fas fa-plus-circle fa-lg"></i>
            </div>
          </div>

        </div>
  
      </div>
    );
  }
}

export default App;
