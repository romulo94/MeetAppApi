import getDurationInMilliseconds from '../../lib/calculeTimeProcess';

export default (req, res, next) => {
  const start = process.hrtime();
  const started = `${req.method} ${req.originalUrl} [STARTED] ${start}`;

  res.on('finish', () => {
    const durationInMilliseconds = getDurationInMilliseconds(start);
    const finished = `${req.method} ${
      req.originalUrl
    } [FINISHED] ${durationInMilliseconds.toLocaleString()} ms`;

    const log = {
      user: req.userId,
      started,
      message: finished,
      status: res.statusCode,
    };

    console.log(log);
  });

  res.on('close', () => {
    const durationInMilliseconds = getDurationInMilliseconds(start);
    const closed = `${req.method} ${
      req.originalUrl
    } [CLOSED] ${durationInMilliseconds.toLocaleString()} ms`;

    const log = {
      user: req.userId,
      started,
      message: closed,
      status: res.statusCode,
    };

    console.log(log);
  });

  next();
};
