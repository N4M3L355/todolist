import React from 'react';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: JSON.parse(localStorage.getItem("tasks")) || [
        {name: "husle", duration: 0.75, elapsed: 0},
        {name: "trieda", duration: 0.75, elapsed: 0},
        {name: "izba", duration: 1, elapsed: 0},
        {name: "zabudol som", duration: 2, elapsed: 0},
        {name: "sacharid", duration: 1.5, elapsed: 0.75},
        {name: "hra", duration: 0.75, elapsed: 0},
        {name: "Es", duration: 0.75, elapsed: 0},
        {name: "Toto", duration: 6, elapsed: 4.5}
      ],
      deadline: 22,
      timeRemaining: 0

    }
  }

  tick() {
    this.setState(() => {
      let now = new Date();
      return {timeRemaining: this.state.deadline - (now - now.getTimezoneOffset() * 60 * 1000) % (1000 * 60 * 60 * 24) / (60 * 60 * 1000)}
    })
  }

  componentDidMount() {
    this.tick();
    this.interval = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  componentDidUpdate() {
    localStorage.setItem("tasks", JSON.stringify(this.state.tasks));
  }

  render() {
    return (
      <div className="App">
        <TaskList tasks={this.state.tasks} color={this.getColor()}
                  time={(this.state.timeRemaining - this.getTotalRemaining()) / this.getTotalElapsed()}
                  onClick={(i, d) => this.handleClick(i, d)}/>
        <div className="new-task" >
          <span onClick={() => this.createNewTask()} style={{padding: "2vh"}}>Add Task</span>
          <span onClick={() => this.removeLastTask()} style={{padding: "2vh"}}>Remove last Task</span>
          <span onClick={() => this.fullScreen()} style={{padding: "2vh"}}>Full Screen</span>
        </div>
        {/*{this.getTotalElapsed()}+{this.getTotalRemaining()}={this.getTotalDuration()},-{this.getTimeRemaining()},~{(this.getTimeRemaining() - this.getTotalRemaining())}*/}
      </div>
    );
  }

  createNewTask() {
    this.setState((state) => ({
      tasks: state.tasks.concat({
        elapsed: 0,
        name: window.prompt("name"),
        duration: +window.prompt("duration")
      })
    }));
  }

  removeLastTask() {
    this.setState(state => ({tasks: state.tasks.slice(0,-1)}));
  }

  handleClick(i, d) {
    this.setState((state) => ({tasks: state.tasks.map((task, index) => index === i ? Object.assign(task, {elapsed: Math.max(Math.min(task.elapsed + d / 4, task.duration), 0)}) : task)}));
  }

  getTotalDuration() {
    return this.state.tasks.reduce((a, b) => a + b.duration, 0);
  }

  getColor() {
    let q = 1 - (this.state.timeRemaining - this.getTotalRemaining()) / this.state.timeRemaining;
    q = (Math.min(Math.max(q, 0.5), 1) - 1) * -2;
    return `hsl(${q === 0 ? 0 : (30 + q * 60)},100%,50%)`
  }

  getTotalElapsed() {
    return this.state.tasks.reduce((a, b) => a + b.elapsed, 0);
  }

  getTotalRemaining() {
    return this.getTotalDuration() - this.getTotalElapsed();
  }

  fullScreen() {
    let elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { /* Firefox */
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE/Edge */
      elem.msRequestFullscreen();
    }
  }
}

class TaskList extends React.Component {
  render() {
    return this.props.tasks.map((task, i) => <Task key={i} name={task.name} order={i} duration={task.duration}
                                                   width={100/Math.max(Math.min(this.props.tasks.length,12),5)}
                                                   color={this.props.color} time={this.props.time}
                                                   elapsed={task.elapsed} onClickLeft={() => this.props.onClick(i, -1)}
                                                   onClickRight={() => this.props.onClick(i, 1)}/>)
  }
}

const Task = (props) => <div className="task-container" style={{
  position: "relative",
  height: `${props.width}vh`,
  fontSize: `${Math.min(props.width,100/((props.name+props.duration).length))}vmin`

}}>{`${props.name} ${props.duration}`}
  <div className="task-bar" style={{

    width: `${props.elapsed / props.duration * 100}%`,
    left: "0",
    backgroundColor: `#FFF`,
    mixBlendMode: "exclusion",
  }} onClick={props.onClickLeft}/>
  <div className="task-bar" style={{
    width: `${(1 - props.elapsed / props.duration) * 100}%`,
    right: "0",
    backgroundColor: `#000`,
    mixBlendMode: "exclusion",
  }} onClick={props.onClickRight}/>
  <div className="task-bar" style={{
    pointerEvents: "none",
    right: `${(1 + props.time * (props.elapsed / props.duration) - (props.elapsed / props.duration)) * 100}%`,
    left: "0",
    backgroundColor: `${props.color}`,
    mixBlendMode: "screen",
  }}/>
  <div className="task-bar" style={{
    pointerEvents: "none",
    left: `${(-props.time * (props.elapsed / props.duration) + (props.elapsed / props.duration)) * 100}%`,
    right: "0",
    backgroundColor: `${props.color}`,
    mixBlendMode: "multiply",
  }}/>
</div>;
/*
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo"/>
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}
*/
export default App;
