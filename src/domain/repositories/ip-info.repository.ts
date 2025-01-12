import {IPInfo} from '../entities/ip-info.entity';

export interface IPInfoRepository {
    save(ip: string, ipInfo: IPInfo): Promise<void>;

    findByIp(ip: string): Promise<IPInfo | null>;

    removeByIp(ip: string): Promise<void>;
}
