import React from 'react'
import {
  FeatureGroup,
  LayersControl,
  Map,
  Marker,
  Popup,
  TileLayer as Basemap
} from 'react-leaflet'
import HeatmapLayer from '../map_layers/HeatmapLayer'
import EntryAPI from '../api/entryAPI.js'
import Entry from '../models/entry.js'

const CARTO_BASEMAP = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'

export class RealTimeMapTab extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      entriesRows: [],
      center: [41.4, 2.15],
      zoom: 12.5,
      motoPoints: []
    }
  }

  componentDidMount() {
    EntryAPI.getAllEntries(false, response => {
      let auxMotoPoints = []
      var results = response.message.map(entry => {
        auxMotoPoints.push(entry.position)

        return new Entry(
          entry.id,
          entry.license_plate,
          entry.position.reverse(), // Revert for Leaflet
          entry.range / 1000 // Meters to km
        )
      })
      this.setState({ motoPoints: auxMotoPoints })
      this.setState({ entriesRows: results })
    })
  }

  render() {
    const { center, zoom } = this.state

    return (
      <div>
        <Map center={center} zoom={zoom} style={mapStyles}>
          <LayersControl>
            <LayersControl.BaseLayer name="Base" checked>
              <Basemap attribution="" url={CARTO_BASEMAP} />
            </LayersControl.BaseLayer>

            <LayersControl.Overlay name="Heatmap" checked>
              <FeatureGroup color="purple">
                <HeatmapLayer
                  fitBoundsOnLoad
                  points={this.state.motoPoints}
                  longitudeExtractor={m => m[1]}
                  latitudeExtractor={m => m[0]}
                  intensityExtractor={m => parseFloat('10')}
                />
              </FeatureGroup>
            </LayersControl.Overlay>

            <LayersControl.Overlay name="Markers">
              <FeatureGroup color="red">
                {this.state.entriesRows.map(entry => (
                  <Marker key={`marker-${entry.id}`} position={entry.position}>
                    <Popup>
                      <div>
                        ID: {entry.id}
                        <br />
                        License Plate: {entry.license_plate}
                        <br />
                        Coordinates: {entry.position[0]}, {entry.position[1]}
                        <br />
                        Range: {entry.range} km.
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </FeatureGroup>
            </LayersControl.Overlay>
          </LayersControl>
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
