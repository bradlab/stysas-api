import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { IAbonnemntService } from './abonnement.service.interface';
import { AbonnementFactory } from 'adapter/factory/abonnement.factory';
import { OAbonnement } from 'domain/model/subscription.model';
import { ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IDParamDTO, IDsParamDTO } from 'adapter/param.dto';
import { DocAbonnementDTO } from './doc.abonnement.dto';
import { AbonnementQuerDTO, CreateAbonnementDTO, UpdateAbonnementDTO } from './abonnement.input.dto';
import { StaffGuard } from 'adapter/guard/auth.guard';

@ApiTags('Gestion des abonnements')
@UseGuards(StaffGuard)
@ApiBearerAuth()
@Controller('abonnements')
export class AbonnementController {
  constructor(private readonly subscriptionService: IAbonnemntService) {}

  @Get()
    @ApiOperation({
      summary: 'Liste des abonnements',
      description: 'Fetch all subscriptions in the DB',
    })
    @ApiResponse({ type: DocAbonnementDTO, isArray: true })
    async all(@Query() param: AbonnementQuerDTO): Promise<OAbonnement[]> {
      if (param && typeof param.ids === 'string') {
        const ids: string = param.ids;
        param.ids = ids?.split(',');
      }
      const subscriptions = await this.subscriptionService.fetchAll(param);
      return subscriptions.map((subscription) => AbonnementFactory.getAbonnement(subscription));
    }
  
    @Get(':id')
    @ApiOperation({
      summary: 'One Subscription',
      description: 'Fetch subscription by ID',
    })
    @ApiParam({
      type: String,
      name: 'id',
      description: 'ID of the needed clinic',
    })
    @ApiResponse({ type: DocAbonnementDTO })
    async show(@Param() { id }: IDParamDTO): Promise<OAbonnement> {
      return AbonnementFactory.getAbonnement(await this.subscriptionService.fetchOne(id));
    }
  
    /**
     * @method POST
     */
  
    @Post()
    @ApiOperation({
      summary: 'Create customer subscription',
    })
    async create(
      @Body() data: CreateAbonnementDTO,
    ): Promise<OAbonnement> {
      const subscription = await this.subscriptionService.add(data);
      return AbonnementFactory.getAbonnement(subscription);
    }
  
    /**
     * @method PATCH
     */
  
    @Patch()
    @ApiOperation({ summary: 'Update adherent subscription' })
    @ApiBody({ type: UpdateAbonnementDTO })
    @ApiResponse({ type: DocAbonnementDTO })
    async update(@Body() data: UpdateAbonnementDTO): Promise<OAbonnement> {
      return AbonnementFactory.getAbonnement(await this.subscriptionService.edit(data));
    }

    
    @Patch('state')
    @ApiOperation({ summary: "Modification d'état des abonnements" })
    @ApiBody({
      type: IDsParamDTO,
      description: 'Id des abonnements concernés',
    })
    @ApiResponse({ type: Boolean })
    async setState(@Body() { ids }: IDsParamDTO): Promise<boolean> {
      if (ids) {
        if (ids && typeof ids === 'string') ids = [ids];
        return await this.subscriptionService.setState(ids);
      }
      return false;
    }
    
  
    /**
     * @method DELETE
     */
  
    @Delete(':id')
    @ApiOperation({ summary: 'Remove Subscription' })
    @ApiParam({
      type: String,
      name: 'id',
      description: 'ID of the subscription to remove',
    })
    @ApiResponse({ type: Boolean })
    remove(@Param() { id }: IDParamDTO): Promise<boolean> {
      return this.subscriptionService.remove(id);
    }
}
