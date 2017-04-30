import Report from '../../models/report';

export async function createReport(report) {

  try {
    report = new Report(report);

    return await report.save();

  } catch (err) {

    err.error = true;
    return err;

  }

}

export async function getReportsForLocation(geoLocation) {

  try {

    return await Report.find({
      location: {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: geoLocation
          },
          $maxDistance: 5000
        }
      }

    });

  } catch (err) {

    err.error = true;
    return err;

  }

}

export async function getLowestRain() {

  try {

    return await Report.aggregate([{
        "$group": {
          "_id": "$rain",
          "docs": {
            "$push": "$$ROOT"
          }
        }
      },
      {
        "$sort": {
          "_id": 1
        }
      },
      {
        "$limit": 1
      }
    ])

  } catch (err) {

    err.error = true;
    return err;
  }

}
