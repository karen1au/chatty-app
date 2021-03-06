import React, {Component} from 'react';
import Chatbar from './ChatBar.jsx';
import MessageList from './MessageList.jsx';

class Navbar extends Component {
  render() {
    return (
      <nav className="navbar">
        <a href="/" className="navbar-brand">Operation Chatty .-- . .-.. -.-. --- -- .</a>
        <span>{this.props.userNum} agents online</span>
      </nav>
      )
  }
}

class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      currentUser: {name: "anonymous"},
      messages: [],
      active: ""
    }

  }

  componentDidMount() {
    console.log("componentDidMount <App />");
    this.socket = new WebSocket("ws://localhost:3001")
    this.socket.onopen = () => console.log("connected to the server");
    this.socket.onmessage = event => {
      const message = JSON.parse(event.data)
        if (message.type){
          this.setState({messages: [...this.state.messages, message]});
        } else {
          this.setState({active: message})
        }
    }
  }
  
  addMessage(content){
    const newMsg = {
      type: "postMessage",
      username: this.state.currentUser.name,
      content: content
    }
      console.log('msg',newMsg)
      this.socket.send(JSON.stringify(newMsg))
  }

  addUser(user){
    const newNoti = {
      type: "postNotification",
      content: this.state.currentUser.name + ' has changed their name to ' + user
    }
    this.socket.send(JSON.stringify(newNoti))
    this.setState({currentUser: {name : user}})
  }
    

  render() {
    return (
      <div>
        <Navbar userNum={this.state.active}/>
        <MessageList messages={this.state.messages}/>
        <Chatbar name={this.state.currentUser.name} setMsg={this.addMessage.bind(this)}
                 setUser={this.addUser.bind(this)}/>
      </div>
    );
  }
}
export default App;
