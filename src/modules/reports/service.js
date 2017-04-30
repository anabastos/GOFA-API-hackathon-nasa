import * as reportRepository from './repository';

export async function createReport(ctx) {

  const report = await reportRepository.createReport(ctx.request.body.report);

  if (!report || report.error)
    ctx.throw(400, report)

  ctx.body = {
    report
  }
}

export async function getReportsForLocation(ctx) {

  const geoLocation = ctx.query.location;

  const formatGeoLocation = geoLocation.split(',');

  const reports = await reportRepository.getReportsForLocation(formatGeoLocation);

  if (!reports || reports.error)
    ctx.throw(400, reports);

  ctx.body = {
    reports
  }
}
