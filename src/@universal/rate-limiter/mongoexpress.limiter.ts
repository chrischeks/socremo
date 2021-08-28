import RateLimit = require('express-rate-limit');
import MongoStore = require('rate-limit-mongo');
import config from 'config';

const { limiterConfig, MONGODB_URL } = config.get('config');
const { expireTimeMs, max } = limiterConfig;

export const limiter = new RateLimit({
  store: new MongoStore({
    uri: MONGODB_URL,
    expireTimeMs: Number(expireTimeMs),
    errorHandler: console.error.bind(null, 'rate-limit-mongo'),
  }),
  max: Number(max),
  windowMs: Number(expireTimeMs),
});
