import { v1 } from 'uuid';
import getDurationInMilliseconds from '../../lib/CalculeTimeProcess';
import Log from '../../lib/Log';

export default (req, res, next) => {
  const start = process.hrtime();
  const id = v1();

  const started = `${req.method} ${req.originalUrl} [STARTED]`;

  res.on('finish', () => {
    const durationInMilliseconds = getDurationInMilliseconds(start);
    const finished = `${req.method} ${
      req.originalUrl
    } [FINISHED] ${durationInMilliseconds.toLocaleString()} ms`;
    const log = {
      id,
      timestamp: new Date(),
      ip: req.ip,
      duration: `${durationInMilliseconds.toLocaleString()} ms`,
      headers: req.headers,
      user: req.userId,
      query: req.query,
      params: req.params,
      started,
      message: finished,
      status: res.statusCode,
    };

    Log.logger().info({
      ...log,
    });
  });

  res.on('close', () => {
    const durationInMilliseconds = getDurationInMilliseconds(start);
    const closed = `${req.method} ${
      req.originalUrl
    } [CLOSED] ${durationInMilliseconds.toLocaleString()} ms`;

    const log = {
      id,
      timestamp: new Date(),
      ip: req.ip,
      headers: req.headers,
      user: req.userId,
      query: req.query,
      params: req.params,
      started,
      message: closed,
      status: res.statusCode,
    };

    Log.logger().error({
      ...log,
    });
  });

  next();
};
