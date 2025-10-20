import redis, { RedisClientType } from "redis"


let client:RedisClientType|null = null;

export const createCache = async():Promise<RedisClientType>=>{
    if(!client){
        client = await redis.createClient({
            url:process.env.REDIS_URL
        })
        client.connect()
    }
    return client;
}


