// RedisHelper.js
import redis from 'redis';
const redisClient = redis.createClient(6379, '127.0.0.1');

redisClient.connect();

redisClient.on('connect', function() {
    console.log('Redis client connected');
});

redisClient.on('error', (error)=>{
    console.log(error);
});

const getRedishData = (key) => {
    return redisClient.get(key);
};

export const setRedishData = (key, value) => {
    return redisClient.set(key, value);
};

export default getRedishData;
