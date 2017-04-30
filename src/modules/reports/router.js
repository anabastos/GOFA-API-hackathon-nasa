import * as report from './service'

export const baseUrl = '/history'

export default [
  {
    method: 'POST',
    route: '/',
    handlers: [
      report.createReport
    ]
  },
  {
    method: 'GET',
    route: '/',
    handlers: [
        report.getReportsForLocation
    ]
  }
]
