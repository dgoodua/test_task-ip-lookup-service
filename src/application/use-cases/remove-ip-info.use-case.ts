import {Inject, Injectable} from '@nestjs/common';
import {IPInfoRepository} from '../../domain/repositories/ip-info.repository';

@Injectable()
export class RemoveIPInfoUseCase {
    constructor(
        @Inject('IPInfoRepository')
        private readonly ipInfoRepository: IPInfoRepository,
    ) {
    }

    async execute(ip: string): Promise<string> {
        await this.ipInfoRepository.removeByIp(ip);
        return ip;
    }
}
