import request from 'request';

import { neural } from '../../services/brain';

export async function getForecast(ctx, next) {

  const geoLocation = ctx.query.location;

  const forecast = await forecastApixu(geoLocation);

  // const geoLocationText = await mapBoxGeoToText(geoLocation);

  const formatGeoLocation = geoLocation.split(',');

  const predict = await neural(formatGeoLocation, forecast.precip_mm);

  if (!forecast)
    ctx.throw(400);

  // if (!geoLocationText)
  //   ctx.throw(400);

  ctx.body = {
    forecast,
    predict
  }

}

// Apixu Forecast
export async function forecastApixu(geoLocation) {

  return new Promise((resolve, reject) => {

    request('https://api.apixu.com/v1/current.json?key=7cdf87980da34b42894183332172904&q=' + geoLocation, function (err, response, body) {

      if (err)
        return reject(err);

      let forecast = JSON.parse(body);

      forecast = {
        name: forecast.location.name,
        region: forecast.location.region,
        country: forecast.location.country,
        localtime: forecast.location.localtime,
        temp: forecast.current.temp_c,
        feelslike: forecast.current.feelslike_c,
        precip_mm: forecast.current.precip_mm,
      };

      resolve(forecast);

    });

  });

}

// MapBox tranforms geoLocation to text
async function mapBoxGeoToText(geoLocation) {

  console.log(geoLocation)

  return new Promise((resolve, reject) => {

    request('https://api.mapbox.com/geocoding/v5/mapbox.places/' + geoLocation + '.json?access_token=pk.eyJ1IjoibHVjYXNhbmpvcyIsImEiOiJjajIzbzc0YTIwMHB2MzJxaXEyOGRwZXQ1In0.sdpE4SUADo5PsdrEduzmfQ', function (err, response, body) {

      if (err)
        return reject(err);

      let geoLocationText = JSON.parse(body);

      console.log(geoLocationText);

      geoLocationText = geoLocationText.features[0].place_name;

      resolve(geoLocationText);

    });

  });

}
