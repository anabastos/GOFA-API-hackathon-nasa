import * as forecast from './service'

export const baseUrl = '/forecast'

export default [
  {
    method: 'GET',
    route: '/',
    handlers: [
      forecast.getForecast
    ]
  }
]
