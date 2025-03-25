import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { IEntraineurService } from './entraineur.service.interface';
import { EntraineurFactory } from 'adapter/factory/entraineur.factory';
import { OEntraineur } from 'domain/model/coach.model';
import { ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IDParamDTO, IDsParamDTO } from 'adapter/param.dto';
import { DocEntraineurDTO } from './doc.entraineur.dto';
import { AEntraineurQuerDTO, CreateEntraineurDTO, UpdateEntraineurDTO } from './entraineur.input.dto';
import { StaffGuard } from 'adapter/guard/auth.guard';

@ApiTags('Gestion des entraineurs')
@UseGuards(StaffGuard)
@ApiBearerAuth()
@Controller('entraineurs')
export class EntraineurController {
  constructor(private readonly entraineurService: IEntraineurService) {}

  @Get()
    @ApiOperation({
      summary: 'Liste des entraineurs',
      description: 'Fetch all entraineurs in the DB',
    })
    @ApiResponse({ type: DocEntraineurDTO, isArray: true })
    async all(@Query() param: AEntraineurQuerDTO): Promise<OEntraineur[]> {
      if (param && typeof param.ids === 'string') {
        const ids: string = param.ids;
        param.ids = ids?.split(',');
      }
      const entraineurs = await this.entraineurService.fetchAll(param);
      return entraineurs.map((entraineur) => EntraineurFactory.getEntraineur(entraineur));
    }
  
    @Get(':id')
    @ApiOperation({
      summary: 'One Entraineur',
      description: 'Fetch entraineur by ID',
    })
    @ApiParam({
      type: String,
      name: 'id',
      description: 'ID of the needed clinic',
    })
    @ApiResponse({ type: DocEntraineurDTO })
    async show(@Param() { id }: IDParamDTO): Promise<OEntraineur> {
      return EntraineurFactory.getEntraineur(await this.entraineurService.fetchOne(id), true);
    }
  
    /**
     * @method POST
     */
  
    @Post()
    @ApiOperation({
      summary: 'Create customer entraineur',
    })
    async create(
      @Body() data: CreateEntraineurDTO,
    ): Promise<OEntraineur> {
      const entraineur = await this.entraineurService.add(data);
      return EntraineurFactory.getEntraineur(entraineur);
    }
  
    /**
     * @method PATCH
     */
  
    @Patch()
    @ApiOperation({ summary: 'Update adherent entraineur' })
    @ApiBody({ type: UpdateEntraineurDTO })
    @ApiResponse({ type: DocEntraineurDTO })
    async update(@Body() data: UpdateEntraineurDTO): Promise<OEntraineur> {
      return EntraineurFactory.getEntraineur(await this.entraineurService.edit(data));
    }
  
    /**
     * @method DELETE
     */
  
    @Delete(':id')
    @ApiOperation({ summary: 'Remove Entraineur' })
    @ApiParam({
      type: String,
      name: 'id',
      description: 'ID of the entraineur to remove',
    })
    @ApiResponse({ type: Boolean })
    remove(@Param() { id }: IDParamDTO): Promise<boolean> {
      return this.entraineurService.remove(id);
    }
}
