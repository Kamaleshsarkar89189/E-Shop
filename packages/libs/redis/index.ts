import Redis from "ioredis";

// const redis = new Redis({
//   host: process.env.REDIS_HOST || "127.0.0.1",
//   port: Number(process.env.REDIS_PORT) || 6379,
//   password: process.env.REDIS_PASSWORD,
// });

const redis = new Redis("rediss://default:gQAAAAAAAVmaAAIncDI5ZWJlNjlkMDdlYTI0NWMwOWJhMmJjYTRlNDg4YmI1M3AyODg0NzQ@flying-ewe-88474.upstash.io:6379")

export default redis;
