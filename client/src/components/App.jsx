import React from 'react';

import style from '../style.css';
import Table from './Room/Table'

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      page: 1,
    };
  };

  render() {
    const { page } = this.state;
    if (page === 1) {
      return (
        <Table />
      );
    }
  };

};

export default App;
