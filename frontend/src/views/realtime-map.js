import React from 'react'
import {
  FeatureGroup,
  GeoJSON,
  LayersControl,
  Map,
  Marker,
  Popup,
  TileLayer as Basemap
} from 'react-leaflet'
import HeatmapLayer from '../map_layers/HeatmapLayer'
import { GreenIcon, OrangeIcon, RedIcon } from '../map_layers/icons'
import Zones from '../map_layers/zones'
import EntryAPI from '../api/entryAPI.js'
import Entry from '../models/entry.js'
import System from '../models/system.js'

const CARTO_BASEMAP = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'

export class RealTimeMapTab extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      entriesRows: [],
      systemsRows: '',
      center: [41.4, 2.155],
      zoom: 12.5,
      motoPoints: [],
      filteredZones: '',
      test: 0
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

      this.updateFilteredZone('None')
    })

    EntryAPI.getAllSystems(false, response => {
      var results = response.message.map(system => {
        return new System(system.id, system.name, system.geofence)
      })

      this.setState({
        systemsRows: {
          type: 'Feature',
          properties: {},
          geometry: JSON.parse(results[0].geofence)
        }
      })
    })
  }

  getIconFromRangeValue(rangeValue) {
    if (rangeValue > 30) {
      return GreenIcon
    } else if (rangeValue > 15) {
      return OrangeIcon
    } else {
      return RedIcon
    }
  }

  updateFilteredZone(typeOfRestriction) {
    var zones = Zones

    if (typeOfRestriction === 'None') {
      this.setState({ test: 1 })
    } else {
      zones = {
        type: 'FeatureCollection',
        features: []
      }
      this.setState({ test: 2 })
    }

    this.setState({ filteredZones: zones })
  }

  onClick(id, icon) {
    console.log('I clicked on ' + id)

    if (icon === GreenIcon) {
      this.updateFilteredZone('All')
    } else if (icon === OrangeIcon) {
      this.updateFilteredZone('All')
    } else if (icon === RedIcon) {
      this.updateFilteredZone('None')
    }
  }

  render() {
    const { center, zoom } = this.state

    return (
      <div>
        <Map center={center} zoom={zoom} style={mapStyles}>
          <LayersControl>
            <Basemap attribution="" url={CARTO_BASEMAP} />
            <LayersControl.Overlay name="Heatmap" checked>
              <FeatureGroup color="purple">
                <HeatmapLayer
                  fitBoundsOnLoad
                  points={this.state.motoPoints}
                  longitudeExtractor={m => m[1]}
                  latitudeExtractor={m => m[0]}
                  intensityExtractor={m => parseFloat('100')}
                />
              </FeatureGroup>
            </LayersControl.Overlay>
            <LayersControl.Overlay name="Markers">
              <FeatureGroup color="red">
                {this.state.entriesRows.map(entry => (
                  <Marker
                    key={`marker-${entry.id}`}
                    position={entry.position}
                    icon={this.getIconFromRangeValue(entry.range)}
                    onClick={() => this.onClick(entry.id, this.getIconFromRangeValue(entry.range))}
                  >
                    <Popup>
                      <div>
                        ID: {entry.id}
                        <br />
                        License Plate: {entry.license_plate}
                        <br />
                        Coordinates: {entry.position[0]}, {entry.position[1]}
                        <br />
                        Range: {entry.range} km
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </FeatureGroup>
            </LayersControl.Overlay>
            <LayersControl.Overlay name="GeoFences" checked>
              <FeatureGroup color="green">
                {this.state.systemsRows !== '' && <GeoJSON data={this.state.systemsRows} />}
              </FeatureGroup>
            </LayersControl.Overlay>
            <LayersControl.Overlay name="Zones" checked>
              <FeatureGroup color="blue">
                {this.state.filteredZones !== '' && (
                  <GeoJSON id={this.state.test} data={this.state.filteredZones} />
                )}
              </FeatureGroup>
            </LayersControl.Overlay>
          </LayersControl>
        </Map>
        {JSON.stringify(this.state.filteredZones)}
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
