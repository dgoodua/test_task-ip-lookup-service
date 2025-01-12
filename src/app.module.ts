import {Module} from '@nestjs/common';
import {Redis} from 'ioredis';
import {IPInfoController} from './presentation/controllers/ip-info.controller';
import {GetIPInfoUseCase} from './application/use-cases/get-ip-info.use-case';
import {RedisIPInfoRepository} from './infrastructure/repositories/redis-ip-info.repository';
import {IPWhoisLookupService} from './infrastructure/services/ipwhois-lookup.service';
import {RemoveIPInfoUseCase} from "./application/use-cases/remove-ip-info.use-case";

@Module({
    controllers: [IPInfoController],
    providers: [
        GetIPInfoUseCase,
        RemoveIPInfoUseCase,
        {
            provide: 'IPInfoRepository',
            useClass: RedisIPInfoRepository,
        },
        {
            provide: 'IPLookupService',
            useClass: IPWhoisLookupService,
        },
        {
            provide: Redis,
            useFactory: () => {
                return new Redis({
                    host: process.env.REDIS_HOST || 'localhost',
                    port: Number(process.env.REDIS_PORT) || 6379,
                });
            },
        },
    ],
    exports: [GetIPInfoUseCase],
})
export class AppModule {
}
