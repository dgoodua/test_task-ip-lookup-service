import {Controller, Get, Delete, Param} from '@nestjs/common';
import {GetIPInfoUseCase} from '../../application/use-cases/get-ip-info.use-case';
import {RemoveIPInfoUseCase} from "../../application/use-cases/remove-ip-info.use-case";

@Controller('ip')
export class IPInfoController {
    constructor(
        private readonly getIPInfoUseCase: GetIPInfoUseCase,
        private readonly removeIPInfoUseCase: RemoveIPInfoUseCase,
    ) {
    }

    @Get(':ip')
    async getIpInfo(@Param('ip') ip: string) {
        return this.getIPInfoUseCase.execute(ip);
    }

    @Delete(':ip')
    async removeIpInfo(@Param('ip') ip: string) {
        await this.removeIPInfoUseCase.execute(ip);
    }
}
