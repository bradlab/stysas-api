import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ICarriereService } from './carriere.service.interface';
import { CarriereFactory } from 'adapter/factory/carriere.factory';
import { OCarriere } from 'domain/model/carriere.model';
import { ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IDParamDTO } from 'adapter/param.dto';
import { DocCarriereDTO } from './doc.carriere.dto';
import { CarriereQueryDTO, CreateCarriereDTO, UpdateCarriereDTO } from './carriere.input.dto';
import { StaffGuard } from 'adapter/guard/auth.guard';

@ApiTags('Gestion des carrieres')
@UseGuards(StaffGuard)
@ApiBearerAuth()
@Controller('carrieres')
export class CarriereController {
  constructor(private readonly carriereService: ICarriereService) {}

  @Get()
    @ApiOperation({
      summary: 'Liste des carrieres',
      description: 'Fetch all carrieres in the DB',
    })
    @ApiResponse({ type: DocCarriereDTO, isArray: true })
    async all(@Query() param: CarriereQueryDTO): Promise<OCarriere[]> {
      if (param && typeof param.ids === 'string') {
        const ids: string = param.ids;
        param.ids = ids?.split(',');
      }
      const carrieres = await this.carriereService.fetchAll(param);
      return carrieres.map((carriere) => CarriereFactory.getCarriere(carriere));
    }
  
    @Get(':id')
    @ApiOperation({
      summary: 'One Carriere',
      description: 'Fetch carriere by ID',
    })
    @ApiParam({
      type: String,
      name: 'id',
    })
    @ApiResponse({ type: DocCarriereDTO })
    async show(@Param() { id }: IDParamDTO): Promise<OCarriere> {
      return CarriereFactory.getCarriere(await this.carriereService.fetchOne(id));
    }
  
    /**
     * @method POST
     */
  
    @Post()
    @ApiOperation({
      summary: 'Create carriere',
    })
    async create(
      @Body() data: CreateCarriereDTO,
    ): Promise<OCarriere> {
      const carriere = await this.carriereService.add(data);
      return CarriereFactory.getCarriere(carriere);
    }
  
    /**
     * @method PATCH
     */
  
    @Patch()
    @ApiOperation({ summary: 'Update carriere' })
    @ApiBody({ type: UpdateCarriereDTO })
    @ApiResponse({ type: DocCarriereDTO })
    async update(@Body() data: UpdateCarriereDTO): Promise<OCarriere> {
      return CarriereFactory.getCarriere(await this.carriereService.edit(data));
    }
  
    /**
     * @method DELETE
     */
  
    @Delete(':id')
    @ApiOperation({ summary: 'Remove Carriere' })
    @ApiParam({
      type: String,
      name: 'id',
      description: 'ID of the carriere to remove',
    })
    @ApiResponse({ type: Boolean })
    remove(@Param() { id }: IDParamDTO): Promise<boolean> {
      return this.carriereService.remove(id);
    }
}
