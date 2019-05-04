import React from 'react'
import { Map, Marker, Popup, TileLayer as Basemap } from 'react-leaflet'

import EntryAPI from '../api/entryAPI.js'
import Entry from '../models/entry.js'

const CARTO_BASEMAP = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'

export class RealTimeMapTab extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      entriesRows: [],
      center: [41.4, 2.15],
      zoom: 12.5
    }
  }

  componentDidMount() {
    EntryAPI.getAllEntries(false, response => {
      var results = response.message.map(entry => {
        return new Entry(
          entry.id,
          entry.license_plate,
          entry.position.reverse(),
          entry.range / 1000 // Meters to km
        )
      })
      this.setState({ entriesRows: results })
    })
  }

  render() {
    const { center, zoom } = this.state

    return (
      <div>
        <Map center={center} zoom={zoom} style={mapStyles}>
          <Basemap attribution="" url={CARTO_BASEMAP} />
          {this.state.entriesRows.map(entry => (
            <Marker key={`marker-${entry.id}`} position={entry.position}>
              <Popup>
                <div>
                  ID: {entry.id}
                  <br />
                  License Plate: {entry.license_plate}
                  <br />
                  Position: {entry.position}
                  <br />
                  Range: {entry.range} km.
                </div>
              </Popup>
            </Marker>
          ))}
        </Map>
      </div>
    )
  }
}

const mapStyles = {
  width: '90vw',
  height: '80vh',
  margin: '0 auto'
}

export default RealTimeMapTab
