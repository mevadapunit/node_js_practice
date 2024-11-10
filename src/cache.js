const Redis = require('ioredis');
const redis = new Redis();

const cache = async (req, res, next) => {
  const { key } = req.params;

  const cachedData = await redis.get(key);
  if (cachedData) {
    return res.status(200).json(JSON.parse(cachedData));
  }

  res.locals.cacheKey = key;
  next();
};

const setCache = async (key, data) => {
  await redis.set(key, JSON.stringify(data), 'EX', 3600);
};

module.exports = { cache, setCache };
