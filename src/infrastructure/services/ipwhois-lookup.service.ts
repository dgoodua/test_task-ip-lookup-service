import {Injectable, HttpException, HttpStatus} from '@nestjs/common';
import axios from 'axios';
import {IPInfo} from '../../domain/entities/ip-info.entity';
import {IPLookupService} from '../../domain/services/ip-lookup.service';

@Injectable()
export class IPWhoisLookupService implements IPLookupService {
    private readonly API_URL = 'http://ipwho.is/';

    async lookup(ip: string): Promise<IPInfo> {
        try {
            const response = await axios.get(`${this.API_URL}${ip}`);
            return response.data;
        } catch (error) {
            throw new HttpException(
                'Failed to lookup IP information',
                HttpStatus.BAD_REQUEST
            );
        }
    }
}
