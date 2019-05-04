// Model of Entry that match with the API's Model

class entry {
  constructor(id, license_plate = 'Sample license', position = [], range = 0) {
    this.id = id
    this.license_plate = license_plate
    this.position = position
    this.range = range
  }
}

export default entry
