import React, { Component } from "react";
import PayrollContract from "./contracts/PayrollFinal.json";
import getWeb3 from "./utils/getWeb3";
import truffleContract from "truffle-contract";

import Accounts from './components/Accounts';
import Employer from './components/Employer';
import Employee from './components/Employee';
import Common from './components/Common';

import "./App.css";

class App extends Component {
  constructor(props){
    super(props)
    this.state={
      storageValue:0,
      web3:null
    }
  }

  componentWillMount () {
    //Get network provider and web instance.

    getWeb3.then(results =>{
      this.setState({
        web3: results.web3
      })
      this.instantiateContract()
    })
    .catch(()=>{
      console.log('Error finding web3.')
    })
  }

  instantiateContract(){
    const contract = require('truffle-contract')
    const Payroll = contract(PayrollContract)
    Payroll.setProvider(this.state.web3.currentProvider)

    var PayrollInstance
    this.state.web3.eth.getAccounts((error,accounts) =>{
      this.setState({
        accounts,
        selectedAccount:accounts[0]
      });
      Payroll.deployed().then((instance)=>{
        PayrollInstance = instance
        this.setState({
          payroll:instance
        });
      })
    })
  }

  onSelectAccount = (ev) =>{
    this.setState({
      selectedAccount:ev.target.text
    });
  }

  render() {
    const {selectedAccount,accounts,payroll,web3} = this.state;
    if (!accounts) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <h2>Smart Contract Example</h2>
        <main className="container">
          <div classname="pure-g">
          <div className = "pure-u-1-3">Accounts accounts={accounts} onSelectAccount={this.onSelectAccount}></div>
            <div className = "pure-u-2-3">
            {
              selectedAccount ===accounts[0] ?
              <Employer employer={selectedAccount} payroll={payroll} web3={web3}/>:
              <Employee employee={selectedAccount} payroll={payroll} web3={web3}/>
            }
            {payroll && <Common account={selectedAccount} payroll = {payroll} web3={web3}/>}
            
            </div>      
          </div>
        </main>
      </div>
    );
  }
}

export default App;
