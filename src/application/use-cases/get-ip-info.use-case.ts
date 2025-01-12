import {Inject, Injectable} from '@nestjs/common';
import {IPInfo} from '../../domain/entities/ip-info.entity';
import {IPInfoRepository} from '../../domain/repositories/ip-info.repository';
import {IPLookupService} from '../../domain/services/ip-lookup.service';

@Injectable()
export class GetIPInfoUseCase {
    constructor(
        @Inject('IPInfoRepository')
        private readonly ipInfoRepository: IPInfoRepository,
        @Inject('IPLookupService')
        private readonly ipLookupService: IPLookupService
    ) {
    }

    async execute(ip: string): Promise<IPInfo> {
        const cachedInfo = await this.ipInfoRepository.findByIp(ip);
        if (cachedInfo) {
            return cachedInfo;
        }

        const ipInfo = await this.ipLookupService.lookup(ip);
        await this.ipInfoRepository.save(ip, ipInfo);
        return ipInfo;
    }
}
