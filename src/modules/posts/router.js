import * as post from './service'

export const baseUrl = '/post'

export default [
  {
    method: 'GET',
    route: '/',
    handlers: [
      post.getPost
    ]
  },
    {
    method: 'POST',
    route: '/',
    handlers: [
      post.postPost
    ]
  }
]
