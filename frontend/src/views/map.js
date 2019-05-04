// Import React and ReactDOM
import React, { Component } from 'react'
import { render } from 'react-dom'

// Import react-leaflet for the map / basemap components
import { Map, TileLayer as Basemap } from 'react-leaflet'

// Import CARTO.js v4 <3
import carto from 'carto.js'

// Import our custom Layer component (it uses carto.js methods internally)
import Layer from '../components/Layer'

// Import the dataset we want to use
import track_points from '../map_layers/track_points'

// Some basic styles
import '../App.css'

// Voyager basemap <3
const CARTO_BASEMAP = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'

export class MapTab extends React.Component {
  // Add some initial state for the center and the zoom
  state = {
    center: [41.4, 2.4],
    zoom: 13
  }

  constructor(props) {
    super(props)

    // Setup the client in the contructor with our user and apiKey
    this.cartoClient = new carto.Client({
      apiKey: 'dcca5595b7e5c1eae29f940d65e3496230d834e4',
      username: 'ecooltra-carto-04'
    })
  }

  componentDidMount() {}

  render() {
    const { center, zoom } = this.state

    return (
      <div>
        {/* Create a Map component, with our center, zoom and some styles so it's centered in the browser */}
        <Map center={center} zoom={zoom} style={mapStyles}>
          {/* Inside the Map component we add the basemap, in this case Voyager */}
          <Basemap attribution="" url={CARTO_BASEMAP} />

          {/* Now can just add as many layers as we want with the Layer component */}
          {/* which takes a source (sql or dataset name), styles (cartoCSS) and the client (our user/apiKey) */}
          <Layer
            source={track_points.source}
            style={track_points.style}
            client={this.cartoClient}
          />
        </Map>
      </div>
    )
  }
}

const mapStyles = {
  width: '90vw',
  height: '75vh',
  margin: '0 auto'
}

export default MapTab
