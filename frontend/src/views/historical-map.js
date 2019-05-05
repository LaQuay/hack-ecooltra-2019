import React from 'react'
import { Map, TileLayer as Basemap } from 'react-leaflet'
import carto from 'carto.js'

import Layer from '../components/Layer'
import track_points from '../map_layers/track_points'

const CARTO_BASEMAP = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'

export class HistoricalMapTab extends React.Component {
  state = {
    center: [41.4, 2.15],
    zoom: 12.5
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
        {false && (
          <Map center={center} zoom={zoom} style={mapStyles}>
            <Basemap attribution="" url={CARTO_BASEMAP} />

            <Layer
              source={track_points.source}
              style={track_points.style}
              client={this.cartoClient}
            />
          </Map>
        )}
        <iframe
          style={mapStyles}
          frameborder="0"
          src="https://cartoworkshops.carto.com/u/ecooltra-carto-04/builder/f0bcea7b-0959-4ecd-8dae-0062ff78bde2/embed"
          allowfullscreen
          webkitallowfullscreen
          mozallowfullscreen
          oallowfullscreen
          msallowfullscreen
        />
      </div>
    )
  }
}

const mapStyles = {
  width: '95vw',
  height: '80vh',
  margin: '0 auto'
}

export default HistoricalMapTab
