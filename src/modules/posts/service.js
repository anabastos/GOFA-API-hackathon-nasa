import * as postRepository from './repository';
import {
  forecastApixu
} from '../forecast/service';

import {
  createReport
} from '../reports/repository';

export async function getPost(ctx, next) {

  const post = await postRepository.getPosts();

  if (!post)
    ctx.throw(400);

  ctx.body = {
    post
  }

}

export async function postPost(ctx, next) {

  const location = ctx.request.body.post.geoLocation;

  let status;

  if (ctx.request.body.post.status == '5cm of water')
    status = 1;

  if (ctx.request.body.post.status == 'Flood')
    status = 2;

  let rain = await forecastApixu(location);

  rain = rain.precip_mm;

  if (!(rain <= 25)) {
    let createForecast = {
      location,
      status,
      rain
    }

    const forecast = await createReport(createForecast);
  }

  const post = await postRepository.createPost(ctx.request.body.post);

  if (!post || post.error)
    ctx.throw(400, post)

  ctx.body = {
    post
  }

}
