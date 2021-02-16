import axios from 'axios'
import qs from 'querystring'
import config from '../config'

const api = axios.create({
  baseURL: config.api.baseUrl,
  headers: {
    'X-User-Agent': 'API Client ' + config.version,
    Accept: 'application/json',
    'Content-Type': 'application/json'
  },
  params: {
  }
})

api.interceptors.request.use(request => {
  // console.log('Axios Request Object', JSON.stringify(request, null, 2))
  console.log(`apiClient (${request.method.toUpperCase()}) URL: ${request.baseURL}${request.url}?` + qs.stringify(request.params))
  console.log('Inserting request into QUEUE')
  return request
})

api.interceptors.response.use(
  async response => successHandler(response),
  async error => errorHandler(error)
)

const errorHandler = async (error) => {

  const originalRequest = error.config  

  // console.log('Axios Error Object 1', JSON.stringify(error, null, 2))

  // Assume possible CORS error when response is empty
  if (typeof error.response === 'undefined') {
    console.warn(`apiClient: Caught possible CORS error!`)
    return await retryRequest(originalRequest)
  }
  
  if (error.response) {
    console.warn(`apiClient: FATAL ERROR DETECTED! (HTTP STATUS ${error.response.status}): ${error.request.responseURL}`)
    return await retryRequest(originalRequest)
  }
  
  // Assuming network error if no HTTP error code
  if (isNetworkError(error)) {
    console.warn('apiClient: NETWORK ERROR DETECTED!')
    return await retryRequest(originalRequest)
    
  }

  return Promise.reject(error)
}

const SUCCESS_STATUS_CODES = [
  200,
  204
]

const successHandler = (response) => {
  if (!SUCCESS_STATUS_CODES.includes(response.status)) {
    console.log(`successHandler status failed (${response.status}): ${response.request.responseURL}`)
  } else {
    // console.log(`API Success (${response.status}): ${response.request.responseURL}`)
  }

  return response
}

async function retryRequest (request) {

  console.log('retryRequest Object ', JSON.stringify(request, null, 2))

  let retryAttempts = 3
  for (let retryAttempt = 0; retryAttempt < retryAttempts; retryAttempt++) {
    console.warn('Retrying request attempt: ' + (retryAttempt + 1))
    return this.transport.request({
      method: request.config.method,
      url: request.config.url,
      params: request.config.params,
      withCredentials: true,
    })
  }
}

function isNetworkError (err) {
  return !!err.isAxiosError && !err.response
}

export {
  api
}
