import React, { Component } from 'react';
import Main from './pages/MainPageComponent'
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Web3 from 'web3'

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  render() {
    return (
      <>
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={Main} />
            <Route path="/adminDashboard" component={AdminDashboard} />
            <Route path="/studentDashboard" component={StudentDashboard} />
            <Route path="/teacherDashboard" component={TeacherDashboard} />

            <Route component={Main} />
          </Switch>
        </BrowserRouter>
      </>
    );
  }
}

export default App;
