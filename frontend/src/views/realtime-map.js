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
import Toggle from 'react-toggle'
import 'react-toggle/style.css'
import HeatmapLayer from '../map_layers/HeatmapLayer'
import { GreenIcon, OrangeIcon, RedIcon } from '../map_layers/icons'
import ExtremeDiscZones from '../map_layers/extreme-disc-zones'
import HighDiscZones from '../map_layers/high-disc-zones'
import MidDiscZones from '../map_layers/mid-disc-zones'
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
      highDiscZones: '',
      midDiscZones: '',
      actualDiscZone: 'None',
      test: 0
    }

    this.handleToggle = this.handleToggle.bind(this)
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

    this.setState({ extremeDiscZones: ExtremeDiscZones })
    this.setState({ highDiscZones: HighDiscZones })
    this.setState({ midDiscZones: MidDiscZones })
    this.setState({ markerStatus: true })
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

  updateFilteredZone(typeOfDiscount) {
    if (typeOfDiscount === 'High') {
      this.setState({ actualDiscZone: 'extreme' })
    } else {
      this.setState({ actualDiscZone: 'none' })
    }
  }

  onClick(id, icon) {
    console.log('I clicked on ' + id)

    if (icon === GreenIcon) {
      this.updateFilteredZone('None')
    } else if (icon === OrangeIcon) {
      this.updateFilteredZone('Mid')
    } else if (icon === RedIcon) {
      this.updateFilteredZone('High')
    }
  }

  handleToggle(event) {
    this.setState({ [event.target.id]: event.target.checked })
  }

  render() {
    const { center, zoom } = this.state
    const labelSpanStyle = {
      'vertical-align': 'super',
      'margin-right': '10px'
    }

    return (
      <div className="row">
        <div className="col-md-2">
          <label>
            <span style={labelSpanStyle}>eCooltra motos</span>
            <Toggle
              id="markerStatus"
              icons={false}
              checked={this.state.markerStatus}
              onChange={this.handleToggle}
            />
          </label>
          <label>
            <span style={labelSpanStyle}>Density map</span>
            <Toggle id="densityMapStatus" icons={false} onChange={this.handleToggle} />
          </label>
          <label>
            <span style={labelSpanStyle}>Geofence</span>
            <Toggle id="geofencesStatus" icons={false} onChange={this.handleToggle} />
          </label>
          <label>
            <span style={labelSpanStyle}>Disponibility zones</span>
            <Toggle id="disponibilityStatus" icons={false} onChange={this.handleToggle} />
          </label>
        </div>
        <div className="col-md-10">
          <Map center={center} zoom={zoom} style={mapStyles}>
            <Basemap attribution="" url={CARTO_BASEMAP} />
            {this.state.densityMapStatus && (
              <HeatmapLayer
                points={this.state.motoPoints}
                longitudeExtractor={m => m[1]}
                latitudeExtractor={m => m[0]}
                intensityExtractor={m => parseFloat('100')}
              />
            )}
            {this.state.markerStatus &&
              this.state.entriesRows.map(entry => (
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
            {this.state.geofencesStatus && this.state.systemsRows !== '' && (
              <GeoJSON data={this.state.systemsRows} />
            )}
            {this.state.disponibilityStatus && this.state.actualDiscZone === 'extreme' && (
              <GeoJSON data={this.state.extremeDiscZones} style={extremeDispStyle} />
            )}
            {this.state.disponibilityStatus && (
              <div>
                <GeoJSON data={this.state.highDiscZones} style={highDispStyle} />
                <GeoJSON data={this.state.midDiscZones} style={medDispStyle} />
              </div>
            )}
          </Map>
        </div>
        Made with
        <em style={{ color: 'red', 'margin-left': '10px', 'margin-right': '10px' }}>❤</em>
        by iLitriTeam
      </div>
    )
  }
}

const mapStyles = {
  width: '75vw',
  height: '80vh',
  margin: '0 auto'
}
const extremeDispStyle = {
  color: 'blue'
}

const highDispStyle = {
  color: 'green'
}

const medDispStyle = {
  color: 'orange'
}

export default RealTimeMapTab
