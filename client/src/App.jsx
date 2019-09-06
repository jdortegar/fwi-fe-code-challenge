import React, { Fragment } from 'react';

import Header from './components/Header/Header';
import PlayerTable from './components/PlayerTable/PlayerTable';

const App = () => {
  return (
    <Fragment>
      <Header />
      <PlayerTable />
    </Fragment>
  );
};

export default App;
