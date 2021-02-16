import { api } from './apiClient'
import config from '../config'

const version = config.api.version

class ApiCalls {

  async getOrder (orderId) {

    return api.get(`${version}/orders/${orderId}`, {
      params: {
      }
    }).catch(e => {
      throw new Error(this.errorHandler('getOrder', e))
    })
  }
  
  errorHandler (functionName, error) {
    return JSON.stringify({ function: functionName, error: error })
    // return JSON.stringify({ function: functionName, code: error.response.status, statusText: error.response.statusText, url: error.response.config.url, errorMsg: error.response.data.error })
  }

}

export {
  ApiCalls
}
