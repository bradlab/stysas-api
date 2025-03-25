import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiExcludeEndpoint,
} from '@nestjs/swagger';
import { IDParamDTO, IDsParamDTO } from 'adapter/param.dto';
import { IAdherentService } from './adherent.service.interface';
import {
  CreateAdherentDTO,
  AdherentQuerDTO,
  UpdateAdherentDTO,
} from './adherent.input.dto';
import { DocAdherentDTO } from './doc.adherent.dto';
import { StaffGuard } from 'adapter/guard/auth.guard';
import { Staff } from 'domain/model/staff.model';
import { AdherentFactory } from 'adapter/factory/adherent.factory';
import { OAdherent } from 'domain/model/adherent.model';
import { GetUser } from 'adapter/decorator';

@ApiTags('Adherent as user management')
@UseGuards(StaffGuard)
@ApiBearerAuth()
@Controller('adherents')
export class AdherentController {
  constructor(private readonly adherentService: IAdherentService) {}

  @Get()
  @ApiOperation({
    summary: 'Adherents list',
    description: 'Fetch all adherents in the DB',
  })
  @ApiResponse({ type: DocAdherentDTO, isArray: true })
  async all(@Query() param: AdherentQuerDTO): Promise<OAdherent[]> {
    if (param && typeof param.ids === 'string') {
      const ids: string = param.ids;
      param.ids = ids?.split(',');
    }
    const adherents = await this.adherentService.fetchAll(param);
    return adherents.map((adherent) => AdherentFactory.getAdherent(adherent));
  }

  @Get('search')
  @ApiOperation({
    summary: 'Single account',
    description: 'Fetch the adherent account by some of its informations',
  })
  @ApiResponse({ type: DocAdherentDTO })
  async search(@Query() param: AdherentQuerDTO): Promise<OAdherent | undefined> {
    if (param) {
      return AdherentFactory.getAdherent(
        await this.adherentService.search(param, undefined),
      );
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'One Adherent',
    description: 'Fetch adherent account by ID',
  })
  @ApiParam({
    type: String,
    name: 'id',
    description: 'ID of the needed clinic',
  })
  @ApiResponse({ type: DocAdherentDTO })
  async show(@Param() { id }: IDParamDTO): Promise<OAdherent> {
    return AdherentFactory.getAdherent(await this.adherentService.fetchOne(id));
  }

  /**
   * @method POST
   */

  @Post()
  @ApiOperation({
    summary: 'Create account adherent',
    description:
      'Créé un adherent B2B',
  })
  async create(
    @Body() data: CreateAdherentDTO,
    @UploadedFile() file: any,
  ): Promise<OAdherent> {
    const adherent = await this.adherentService.add(data);
    return AdherentFactory.getAdherent(adherent);
  }

    @Post('bulk')
    @ApiOperation({ summary: 'Créer une liste de adherents' })
    @ApiResponse({
      status: 200,
      description: "adherents créés avec succès",
      type: DocAdherentDTO,
    })
    async bulk(
      @GetUser() user: Staff,
      @Body() datas: CreateAdherentDTO[],
    ) {
      const adherents = await this.adherentService.bulk(user, datas);
      return adherents?.map((adherent) => AdherentFactory.getAdherent(adherent));
    }

  /**
   * @method PATCH
   */

  @Patch()
  @ApiOperation({ summary: 'Update adherent account' })
  @ApiBody({ type: UpdateAdherentDTO })
  @ApiResponse({ type: DocAdherentDTO })
  async update(@Body() data: UpdateAdherentDTO): Promise<OAdherent> {
    return AdherentFactory.getAdherent(await this.adherentService.edit(data));
  }

  /**
   * @method DELETE
   */

  @ApiExcludeEndpoint()
  @Delete('clean')
  @ApiOperation({ summary: 'Clean removed Accounts' })
  @ApiResponse({ type: Boolean })
  clean(): Promise<boolean> {
    return this.adherentService.clean();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove Account' })
  @ApiParam({
    type: String,
    name: 'id',
    description: 'ID of the adherent to remove',
  })
  @ApiResponse({ type: Boolean })
  remove(@Param() { id }: IDParamDTO): Promise<boolean> {
    return this.adherentService.remove(id);
  }
}
