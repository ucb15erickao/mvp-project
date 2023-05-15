import React from 'react';
import axios from 'axios';

import style from '../style.css';
import CasinoLobby from './CasinoLobby';
import TableList from './TableList';
import TableSetup from './TableSetup';
import Table from './Table/Table';
import { gameState } from './Table/gameLogic/gameFunctions';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      page: 'lobby',
      name: '',
      nameInput: '',
      tables: [],
      tableCount: 0,
      gameState
    };
    this.updateInput = this.updateInput.bind(this);
    this.setName = this.setName.bind(this);
    this.changePage = this.changePage.bind(this);
    this.createTable = this.createTable.bind(this);
    this.joinTable = this.joinTable.bind(this);
  };

  componentDidMount() {
    axios.get('/tables')
      .then(res => {
        console.log('res.data:', res.data);
        this.setState({
          tables: res.data,
          tableCount: Object.keys(res.data).length || 0
        }, () => {
          console.log('state.tables:', this.state.tables);
        });
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
    }, () => {
      console.log('state.name:', this.state.name);
      document.getElementById('nameInput').value = '';
    });
  };

  changePage(destination) {
    this.setState({
      page: destination
    }, () => {  console.log('state.page:', this.state.page)  });
  };

  createTable() {
    let newTableNumber = this.state.tableCount;
    axios.put(`/createTable/${newTableNumber}`)
      .then(res => {
        this.setState({
          page: res.data
        }, () => {  console.log('state.page:', this.state.page)  });
      })
      .catch(error => { console.log('error:', error) });
  };

  joinTable(tableNumber) {
    axios.put(`/joinTable/${tableNumber}`)
      .then(res => {
        this.setState({
          page: res.data
        });
      }, () => {  console.log('state.page:', this.state.page)  })
      .catch(error => { console.log('error:', error) });
  };

  render() {
    const { page, name, tables, gameState } = this.state;
    switch (page) {
      case 'lobby':
        return (
          <CasinoLobby
            changePage={this.changePage}
            updateInput={this.updateInput}
            setName={this.setName}
            name={name}
          />
        );
      case 'tableSetup':
        return (
          <TableSetup
            changePage={this.changePage}
            updateInput={this.updateInput}
            createTable={this.createTable}
          />
        );
      case 'tableList':
        return (
          <TableList
            changePage={this.changePage}
            updateInput={this.updateInput}
            joinTable={this.joinTable}
            tables={tables}
          />
        );
      default:
        return (
          <Table
            changePage={this.changePage}
            tableID={page}
            gameState={gameState}
          />
        );
    }
  };

};

export default App;
