import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, ParseArrayPipe } from '@nestjs/common';
import { ISalleService } from './salle.service.interface';
import { SalleFactory } from 'adapter/factory/salle.factory';
import { OSalle } from 'domain/model/salle.model';
import { ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBody, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'adapter/decorator';
import { IDParamDTO } from 'adapter/param.dto';
import { Staff } from 'domain/model/staff.model';
import { DocSalleDTO } from './doc.salle.dto';
import { SalleQuerDTO, CreateSalleDTO, UpdateSalleDTO } from './salle.input.dto';
import { StaffGuard } from 'adapter/guard/auth.guard';

@ApiTags('Salles sport management')
@UseGuards(StaffGuard)
@ApiBearerAuth()
@Controller('salles')
export class SalleController {
  constructor(private readonly salleService: ISalleService) {}

  @Get()
    @ApiOperation({
      summary: 'Salles list',
      description: 'Fetch all salles in the DB',
    })
    @ApiResponse({ type: DocSalleDTO, isArray: true })
    async all(@Query() param: SalleQuerDTO): Promise<OSalle[]> {
      if (param && typeof param.ids === 'string') {
        const ids: string = param.ids;
        param.ids = ids?.split(',');
      }
      const salles = await this.salleService.fetchAll(param);
      return salles.map((salle) => SalleFactory.getSalle(salle, true));
    }

    @Get(':id')
    @ApiOperation({
      summary: 'One Salle',
      description: 'Fetch salle by ID',
    })
    @ApiParam({
      type: String,
      name: 'id',
      description: 'ID of the needed clinic',
    })
    @ApiResponse({ type: DocSalleDTO })
    async show(@Param() { id }: IDParamDTO): Promise<OSalle> {
      return SalleFactory.getSalle(await this.salleService.fetchOne(id), true);
    }
  
    /**
     * @method POST
     */
  
    @Post()
    @ApiOperation({
      summary: 'Create salle',
      description: 'Créé une salle de sport',
    })
    async create(
      @Body() data: CreateSalleDTO,
    ): Promise<OSalle> {
      const salle = await this.salleService.add(data);
      return SalleFactory.getSalle(salle);
    }
  
      @Post('bulk')
      @ApiOperation({ summary: 'Créer une liste de salles' })
      @ApiResponse({
        status: 200,
        description: "salles créés avec succès",
        type: DocSalleDTO,
      })
      async bulk(
        @GetUser() user: Staff,
        @Body(new ParseArrayPipe({items: CreateSalleDTO})) datas: CreateSalleDTO[],
      ) {
        const salles = await this.salleService.bulk(user, datas);
        return salles?.map((salle) => SalleFactory.getSalle(salle));
      }
  
    /**
     * @method PATCH
     */
  
    @Patch()
    @ApiOperation({ summary: 'Update salle account' })
    @ApiBody({ type: UpdateSalleDTO })
    @ApiResponse({ type: DocSalleDTO })
    async update(@Body() data: UpdateSalleDTO): Promise<OSalle> {
      return SalleFactory.getSalle(await this.salleService.edit(data));
    }
  
    /**
     * @method DELETE
     */
  
    @Delete(':id')
    @ApiOperation({ summary: 'Remove Account' })
    @ApiParam({
      type: String,
      name: 'id',
      description: 'ID of the salle to remove',
    })
    @ApiResponse({ type: Boolean })
    remove(@Param() { id }: IDParamDTO): Promise<boolean> {
      return this.salleService.remove(id);
    }
}
