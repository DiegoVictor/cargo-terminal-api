export default (request, _, next) => {
  const { protocol, hostname, originalUrl } = request;
  const hostUrl = `${protocol}://${hostname}:${process.env.APP_PORT}`;

  request.hostUrl = hostUrl;
  request.currentUrl = `${hostUrl + originalUrl.split('?').shift()}`;

  next();
};
