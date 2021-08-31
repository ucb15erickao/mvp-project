import React from 'react';
import axios from 'axios';

import style from '../style.css';
import CasinoLobby from './CasinoLobby';
import PrivateTables from './PrivateTables';
import Table from './Table/Table';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      page: 'table',
      name: '',
      nameInput: '',
      publicTables: [],
      privateTables: []
    };
    this.updateInput = this.updateInput.bind(this);
    this.setName = this.setName.bind(this);
    this.changePage = this.changePage.bind(this);
    this.privateGame = this.privateGame.bind(this);
  };

  componentDidMount() {
    axios.get('/tables')
      .then(res => {
        console.log(res.data);
        const publicTables = [];
        const privateTables = [];
        this.setState({ publicTables, privateTables }, () => {
          console.log('state.publicTables:', this.state.publicTables);
          console.log('state.privateTables:', this.state.privateTables);
        })
      })
      .catch(error => { console.log('error:', error) });
  };

  updateInput(textInput) {
    this.setState({
      nameInput: textInput
    }, () => { console.log('state.nameInput:', this.state.nameInput) });
  };

  setName() {
    const { nameInput } = this.state;
    this.setState({
      name: nameInput
    }, () => { console.log('state.name:', this.state.name); document.getElementById('nameInput').value = '' });
  };

  changePage(destination) {
    this.setState({
      page: destination
    }, () => { console.log('state.page:', this.state.page) });
  };

  publicGame() {
    //
  };

  privateGame(action) {
    if (action === 'createNew') {
      //
    } else {
      //4
    }
  };

  render() {
    const { page, name } = this.state;
    switch (page) {
      case 'lobby':
        return (
          <CasinoLobby changePage={this.changePage} updateInput={this.updateInput} setName={this.setName} name={name} />
        );
      case 'private':
        return (
          <PrivateTables changePage={this.changePage} publicGame={this.privateGame} />
        );
      case 'table':
        return (
          <Table changePage={this.changePage} />
        );
    }
  };

};

export default App;
