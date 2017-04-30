import brain from 'brain';
import {
  getReportsForLocation,
  getLowestRain
} from '../modules/reports/repository';

export async function neural(geoLocation, precip) {

  // precip = 36;

  let dataFormatted = [];

  const data = await getReportsForLocation(geoLocation); // pega só os dados em um raio de 5km da geoLocation

  if (!data || !data[0])
    return ({
      'error': 'no cities around'
    });

  const lowest = await getLowestRain();

  //pegar o menor indice de rain do banco e considerar tudo abaixo disso como nulo
  if (precip <= lowest[0].docs[0].rain)
    return ({
      'none': 1
    });

  for (let i = 0; i <= data.length - 1; i++) {

    let formating = {
      input: {
        rain: data[i].rain
      }
    };

    if (data[i].status == 1)
      formating.output = {
        flood: 1
      };

    if (data[i].status == 2)
      formating.output = {
        ground: 1
      };

    dataFormatted.push(formating);
  }

  return new Promise((resolve, reject) => {

    const net = new brain.NeuralNetwork();

    net.train(dataFormatted);

    // net.train([{input: { rain: 0.55 }, output: { flood: 1 }},
    //            {input: { rain: 0.35 }, output: { ground: 1 }},
    //            {input: { rain: 0.10 }, output: { none: 1 }}]);

    let output = net.run({
      rain: precip
    });

    if (output.flood > output.ground)
      resolve(output = {
        flood: output.flood
      });

    if (output.flood < output.ground)
      resolve(output = {
        ground: output.ground
      });
  });

}
