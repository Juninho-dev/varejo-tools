import axios from 'axios'

export default axios.create({
  baseURL: 'https://varejo.tools/api',
  timeout: 5000
})
