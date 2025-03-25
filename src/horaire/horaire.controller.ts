import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, ParseArrayPipe } from '@nestjs/common';
import { IHoraireService } from './horaire.service.interface';
import { HoraireFactory } from 'adapter/factory/horaire.factory';
import { OHoraire } from 'domain/model/horaire.model';
import { ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'adapter/decorator';
import { IDParamDTO } from 'adapter/param.dto';
import { Staff } from 'domain/model/staff.model';
import { DocHoraireDTO } from './doc.horaire.dto';
import { HoraireQueryDTO, CreateHoraireDTO, UpdateHoraireDTO } from './horaire.input.dto';
import { StaffGuard } from 'adapter/guard/auth.guard';

@ApiTags("Gestion des horaires")
@UseGuards(StaffGuard)
@ApiBearerAuth()
@Controller('horaires')
export class HoraireController {
  constructor(private readonly horaireService: IHoraireService) {}

  @Get()
    @ApiOperation({
      summary: 'Horaires list',
      description: 'Fetch all horaires in the DB',
    })
    @ApiResponse({ type: DocHoraireDTO, isArray: true })
    async all(@Query() param: HoraireQueryDTO): Promise<OHoraire[]> {
      if (param && typeof param.ids === 'string') {
        const ids: string = param.ids;
        param.ids = ids?.split(',');
      }
      const horaires = await this.horaireService.fetchAll(param);
      return horaires.map((horaire) => HoraireFactory.getHoraire(horaire));
    }
  
    @Get(':id')
    @ApiOperation({
      summary: 'One Horaire',
      description: 'Fetch horaire by ID',
    })
    @ApiParam({
      type: String,
      name: 'id',
      description: 'ID of the needed clinic',
    })
    @ApiResponse({ type: DocHoraireDTO })
    async show(@Param() { id }: IDParamDTO): Promise<OHoraire> {
      return HoraireFactory.getHoraire(await this.horaireService.fetchOne(id), true);
    }
  
    /**
     * @method POST
     */
  
    @Post()
    @ApiOperation({
      summary: 'Create horaire',
      description: 'Ajouter un horaire de salle',
    })
    async create(
      @Body() data: CreateHoraireDTO,
    ): Promise<OHoraire> {
      const horaire = await this.horaireService.add(data);
      return HoraireFactory.getHoraire(horaire);
    }

    @Post('bulk')
    @ApiOperation({ summary: "Créer une liste d'horaires" })
    @ApiResponse({
      status: 200,
      description: "Horaires créés avec succès",
      type: DocHoraireDTO,
    })
    async bulk(
      @GetUser() user: Staff,
      @Body(new ParseArrayPipe({items: CreateHoraireDTO})) datas: CreateHoraireDTO[],
    ) {
      const horaires = await this.horaireService.bulk(datas);
      return horaires?.map((horaire) => HoraireFactory.getHoraire(horaire));
    }
  
    /**
     * @method PATCH
     */
  
    @Patch()
    @ApiOperation({ summary: 'Update horaire account' })
    @ApiBody({ type: UpdateHoraireDTO })
    @ApiResponse({ type: DocHoraireDTO })
    async update(@Body() data: UpdateHoraireDTO): Promise<OHoraire> {
      return HoraireFactory.getHoraire(await this.horaireService.edit(data));
    }
  
    /**
     * @method DELETE
     */
  
    @Delete(':id')
    @ApiOperation({ summary: 'Remove Account' })
    @ApiParam({
      type: String,
      name: 'id',
      description: 'ID of the horaire to remove',
    })
    @ApiResponse({ type: Boolean })
    remove(@Param() { id }: IDParamDTO): Promise<boolean> {
      return this.horaireService.remove(id);
    }
}
