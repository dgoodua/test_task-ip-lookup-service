import {IPInfo} from '../entities/ip-info.entity';

export interface IPLookupService {
    lookup(ip: string): Promise<IPInfo>;
}
