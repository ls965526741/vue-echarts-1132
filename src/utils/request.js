import axios from 'axios'
const request = axios.create({
  baseURL: '/api',
  timeout: 5000
})
request.interceptors.request.use(
  function (config) {
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  function (res) {
    return res.data
  },
  function (error) {
    return Promise.reject(error)
  }
)
export default request
