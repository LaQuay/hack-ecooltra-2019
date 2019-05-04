import ApiServiceBase from './apiServiceBase.js'
import Config from '../config.js'

class EntryAPI extends ApiServiceBase {
  constructor() {
    super()
    this.baseUrl = Config.services.electricfeel.url
  }

  getAllEntries(priority, callback) {
    this.getFromUrl(
      this.baseUrl + `/vehicles/?system_id=barcelona`,
      responseJson => {
        const response = responseJson
        if (response) {
          console.log(response)
          callback(response)
        }
      },
      priority
    )
  }
}

export default new EntryAPI()
