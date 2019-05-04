import React from 'react'

export class RealTimeMapTab extends React.Component {
  state = {
    center: [41.4, 2.15],
    zoom: 12.5
  }

  constructor(props) {
    super(props)
  }

  componentDidMount() {}

  render() {
    const { center, zoom } = this.state

    return <div />
  }
}

const mapStyles = {
  width: '90vw',
  height: '80vh',
  margin: '0 auto'
}

export default RealTimeMapTab
