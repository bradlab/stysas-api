import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, ParseArrayPipe } from '@nestjs/common';
import { IEquipmentService } from './equipment.service.interface';
import { EquipmentFactory } from 'adapter/factory/equipment.factory';
import { OEquipement } from 'domain/model/equipment.model';
import { ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBody, ApiBearerAuth, ApiTags, ApiExcludeEndpoint } from '@nestjs/swagger';
import { GetUser } from 'adapter/decorator';
import { IDParamDTO } from 'adapter/param.dto';
import { Staff } from 'domain/model/staff.model';
import { DocEquipmentDTO } from './doc.equipment.dto';
import { EquipmentQuerDTO, CreateEquipmentDTO, UpdateEquipmentDTO } from './equipment.input.dto';
import { StaffGuard } from 'adapter/guard/auth.guard';

@ApiTags("Salle's equipments management")
@UseGuards(StaffGuard)
@ApiBearerAuth()
@Controller('equipements')
export class EquipmentController {
  constructor(private readonly equipmentService: IEquipmentService) {}

  @Get()
    @ApiOperation({
      summary: 'Equipments list',
      description: 'Fetch all equipements in the DB',
    })
    @ApiResponse({ type: DocEquipmentDTO, isArray: true })
    async all(@Query() param: EquipmentQuerDTO): Promise<OEquipement[]> {
      if (param && typeof param.ids === 'string') {
        const ids: string = param.ids;
        param.ids = ids?.split(',');
      }
      const equipements = await this.equipmentService.fetchAll(param);
      return equipements.map((equipment) => EquipmentFactory.getEquipement(equipment));
    }
  
    @Get(':id')
    @ApiOperation({
      summary: 'One Equipment',
      description: 'Fetch equipment by ID',
    })
    @ApiParam({
      type: String,
      name: 'id',
      description: 'ID of the needed clinic',
    })
    @ApiResponse({ type: DocEquipmentDTO })
    async show(@Param() { id }: IDParamDTO): Promise<OEquipement> {
      return EquipmentFactory.getEquipement(await this.equipmentService.fetchOne(id), true);
    }
  
    /**
     * @method POST
     */
  
    @Post()
    @ApiOperation({
      summary: 'Create equipment',
      description: 'Ajouter un equipment de salle',
    })
    async create(
      @Body() data: CreateEquipmentDTO,
    ): Promise<OEquipement> {
      const equipment = await this.equipmentService.add(data);
      return EquipmentFactory.getEquipement(equipment);
    }

    @ApiExcludeEndpoint()
    @Post('bulk')
    @ApiOperation({ summary: "Créer une liste d'equipements" })
    @ApiResponse({
      status: 200,
      description: "Equipements créés avec succès",
      type: DocEquipmentDTO,
    })
    async bulk(
      @GetUser() user: Staff,
      @Body(new ParseArrayPipe({items: CreateEquipmentDTO})) datas: CreateEquipmentDTO[],
    ) {
      const equipments = await this.equipmentService.bulk(user, datas);
      return equipments?.map((equipment) => EquipmentFactory.getEquipement(equipment));
    }
  
    /**
     * @method PATCH
     */
  
    @Patch()
    @ApiOperation({ summary: 'Update equipment account' })
    @ApiBody({ type: UpdateEquipmentDTO })
    @ApiResponse({ type: DocEquipmentDTO })
    async update(@Body() data: UpdateEquipmentDTO): Promise<OEquipement> {
      return EquipmentFactory.getEquipement(await this.equipmentService.edit(data));
    }
  
    /**
     * @method DELETE
     */
  
    @Delete(':id')
    @ApiOperation({ summary: 'Remove Account' })
    @ApiParam({
      type: String,
      name: 'id',
      description: 'ID of the equipment to remove',
    })
    @ApiResponse({ type: Boolean })
    remove(@Param() { id }: IDParamDTO): Promise<boolean> {
      return this.equipmentService.remove(id);
    }
}
