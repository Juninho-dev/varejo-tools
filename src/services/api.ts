import axios from 'axios'

export default axios.create({
  baseURL: 'https://dom.tools/api',
  timeout: 5000
})
