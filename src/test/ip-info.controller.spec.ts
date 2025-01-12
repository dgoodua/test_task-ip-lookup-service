import {Test} from '@nestjs/testing';
import {GetIPInfoUseCase} from '../application/use-cases/get-ip-info.use-case';
import {IPInfoRepository} from '../domain/repositories/ip-info.repository';
import {IPLookupService} from '../domain/services/ip-lookup.service';
import {IPInfo} from '../domain/entities/ip-info.entity';

describe('GetIPInfoUseCase', () => {
    let useCase: GetIPInfoUseCase;
    let ipInfoRepository: jest.Mocked<IPInfoRepository>;
    let ipLookupService: jest.Mocked<IPLookupService>;

    const mockIpInfo: IPInfo = {
        ip: '1.1.1.1',
        success: true,
        type: 'IPv4',
        continent: 'North America',
        continent_code: 'NA',
        country: 'United States',
        country_code: 'US',
        region: 'California',
        city: 'Los Angeles',
        latitude: 34.0522,
        longitude: -118.2437,
    };

    beforeEach(async () => {
        const mockRepository = {
            findByIp: jest.fn(),
            save: jest.fn(),
            removeByIp: jest.fn()
        };

        const mockLookupService = {
            lookup: jest.fn()
        };

        const moduleRef = await Test.createTestingModule({
            providers: [
                GetIPInfoUseCase,
                {
                    provide: 'IPInfoRepository',
                    useValue: mockRepository
                },
                {
                    provide: 'IPLookupService',
                    useValue: mockLookupService
                }
            ]
        }).compile();

        useCase = moduleRef.get<GetIPInfoUseCase>(GetIPInfoUseCase);
        ipInfoRepository = moduleRef.get('IPInfoRepository');
        ipLookupService = moduleRef.get('IPLookupService');
    });

    describe('execute', () => {
        it('should return cached IP info if available', async () => {
            // Arrange
            ipInfoRepository.findByIp.mockResolvedValue(mockIpInfo);
            ipLookupService.lookup.mockResolvedValue(mockIpInfo);

            // Act
            const result = await useCase.execute('1.1.1.1');

            // Assert
            expect(result).toEqual(mockIpInfo);
            expect(ipInfoRepository.findByIp).toHaveBeenCalledWith('1.1.1.1');
            expect(ipLookupService.lookup).not.toHaveBeenCalled();
            expect(ipInfoRepository.save).not.toHaveBeenCalled();
        });

        it('should lookup and cache IP info if not cached', async () => {
            // Arrange
            ipInfoRepository.findByIp.mockResolvedValue(null);
            ipLookupService.lookup.mockResolvedValue(mockIpInfo);

            // Act
            const result = await useCase.execute('1.1.1.1');

            // Assert
            expect(result).toEqual(mockIpInfo);
            expect(ipInfoRepository.findByIp).toHaveBeenCalledWith('1.1.1.1');
            expect(ipLookupService.lookup).toHaveBeenCalledWith('1.1.1.1');
            expect(ipInfoRepository.save).toHaveBeenCalledWith('1.1.1.1', mockIpInfo);
        });

        it('should propagate errors from lookup service', async () => {
            // Arrange
            const error = new Error('Lookup failed');
            ipInfoRepository.findByIp.mockResolvedValue(null);
            ipLookupService.lookup.mockRejectedValue(error);

            // Act & Assert
            await expect(useCase.execute('1.1.1.1')).rejects.toThrow(error);
            expect(ipInfoRepository.save).not.toHaveBeenCalled();
        });
    });
});