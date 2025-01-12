import {Injectable} from '@nestjs/common';
import {Redis} from 'ioredis';
import {IPInfo} from '../../domain/entities/ip-info.entity';
import {IPInfoRepository} from '../../domain/repositories/ip-info.repository';

@Injectable()
export class RedisIPInfoRepository implements IPInfoRepository {
    private readonly TTL = 60; // 60 seconds

    constructor(private readonly redis: Redis) {
    }

    async save(ip: string, ipInfo: IPInfo): Promise<void> {
        await this.redis.setex(
            `ip:${ip}`,
            this.TTL,
            JSON.stringify(ipInfo)
        );
    }

    async findByIp(ip: string): Promise<IPInfo | null> {
        const data = await this.redis.get(`ip:${ip}`);
        return data ? JSON.parse(data) : null;
    }

    async removeByIp(ip: string): Promise<void> {
        await this.redis.del(`ip:${ip}`);
    }
}
