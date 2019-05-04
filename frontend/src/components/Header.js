import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'

import '../App.css'

class Header extends Component {
  render() {
    return (
      <div>
        <header className="App-header navbar navbar-expand navbar-dark flex-column flex-md-row">
          <div>
            <ul className="navbar-nav">
              <li className="nav-item">
                <NavLink className="nav-link" to="/entry" activeStyle={{ fontWeight: '600' }}>
                  Raw Data
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/historical" activeStyle={{ fontWeight: '600' }}>
                  Historical
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/realtime" activeStyle={{ fontWeight: '600' }}>
                  RealTime
                </NavLink>
              </li>
            </ul>
          </div>
        </header>
      </div>
    )
  }
}

export default Header
