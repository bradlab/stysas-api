import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { IDisponibiliteService } from './disponibilite.service.interface';
import { DisponibiliteFactory } from 'adapter/factory/disponibilite.factory';
import { ODisponibilite } from 'domain/model/disponibilite.model';
import { ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IDParamDTO, IDsParamDTO } from 'adapter/param.dto';
import { DocDisponibiliteDTO } from './doc.disponibilite.dto';
import { DisponibiliteQuerDTO, CreateDisponibiliteDTO, UpdateDisponibiliteDTO } from './disponibilite.input.dto';
import { StaffGuard } from 'adapter/guard/auth.guard';

@ApiTags('Gestion des disponibilites')
@UseGuards(StaffGuard)
@ApiBearerAuth()
@Controller('disponibilites')
export class DisponibiliteController {
  constructor(private readonly disponibiliteService: IDisponibiliteService) {}

  @Get()
    @ApiOperation({
      summary: 'Liste des disponibilites',
      description: 'Fetch all disponibilites in the DB',
    })
    @ApiResponse({ type: DocDisponibiliteDTO, isArray: true })
    async all(@Query() param: DisponibiliteQuerDTO): Promise<ODisponibilite[]> {
      if (param && typeof param.ids === 'string') {
        const ids: string = param.ids;
        param.ids = ids?.split(',');
      }
      const disponibilites = await this.disponibiliteService.fetchAll(param);
      return DisponibiliteFactory.getDisponibilites(disponibilites, true);
    }
  
    @Get(':id')
    @ApiOperation({
      summary: 'One Disponibilite',
      description: 'Fetch disponibilite by ID',
    })
    @ApiParam({
      type: String,
      name: 'id',
      description: 'ID of the needed clinic',
    })
    @ApiResponse({ type: DocDisponibiliteDTO })
    async show(@Param() { id }: IDParamDTO): Promise<ODisponibilite> {
      return DisponibiliteFactory.getDisponibilite(await this.disponibiliteService.fetchOne(id), true);
    }
  
    /**
     * @method POST
     */
  
    @Post()
    @ApiOperation({
      summary: 'Create coach availlability',
    })
    async create(
      @Body() data: CreateDisponibiliteDTO,
    ): Promise<ODisponibilite> {
      const disponibilite = await this.disponibiliteService.add(data);
      return DisponibiliteFactory.getDisponibilite(disponibilite);
    }
  
    /**
     * @method PATCH
     */
  
    @Patch()
    @ApiOperation({ summary: 'Update disponibilite' })
    @ApiBody({ type: UpdateDisponibiliteDTO })
    @ApiResponse({ type: DocDisponibiliteDTO })
    async update(@Body() data: UpdateDisponibiliteDTO): Promise<ODisponibilite> {
      return DisponibiliteFactory.getDisponibilite(await this.disponibiliteService.edit(data));
    }
  
    /**
     * @method DELETE
     */
  
    @Delete(':id')
    @ApiOperation({ summary: 'Remove Disponibilite' })
    @ApiParam({
      type: String,
      name: 'id',
      description: 'ID of the disponibilite to remove',
    })
    @ApiResponse({ type: Boolean })
    remove(@Param() { id }: IDParamDTO): Promise<boolean> {
      return this.disponibiliteService.remove(id);
    }
}
