import React, { Component } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import EntryTab from '../views/entry.js'
import HistoricalTab from '../views/historical-map.js'
import RealTimeTab from '../views/realtime-map.js'

import '../App.css'

class Main extends Component {
  render() {
    return (
      <div>
        <div className="App-content">
          <Switch>
            <Route path="/entry" component={EntryTab} />
            <Route path="/historical" component={HistoricalTab} />
            <Route path="/realtime" component={RealTimeTab} />
            <Redirect from="/" to="/entry" />
          </Switch>
        </div>
      </div>
    )
  }
}

export default Main
