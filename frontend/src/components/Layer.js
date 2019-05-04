import { Component } from 'react'
import PropTypes from 'prop-types'
import carto from 'carto.js'

// This component wraps CARTO.js methods, for now this is
// just a proof of concept, but in the future it would be nice
// to have our own components library like leaflet does

class Layer extends Component {
  static contextTypes = {
    map: PropTypes.object // Leaflet map
  }

  componentDidMount() {
    const { client, source, style } = this.props

    // Craete source, styles and layer with the given props
    const cartoSource = new carto.source.SQL(source)
    const cartoCSS = new carto.style.CartoCSS(style)
    const layer = new carto.layer.Layer(cartoSource, cartoCSS)

    // Add them to the client and to the map
    client.addLayer(layer)
    client.getLeafletLayer().addTo(this.context.map)
  }

  // ... missing methods to handle styles/source updates
  render() {
    return null // No need to render anything :)
  }
}

export default Layer
