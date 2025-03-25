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
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiParam,
  ApiConsumes,
  ApiQuery,
  ApiExcludeEndpoint,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { DataGenerator } from 'domain/generator/data.generator';
import { IDParamDTO, IDsParamDTO } from 'adapter/param.dto';
import { BaseDashboardMetric, IStaffService } from './staff.service.interface';
import {
  UserQuerDTO,
  RegisterStaffDTO,
  UpdateClientDTO,
} from './staff.input.dto';
import { StaffFactory } from '../_shared/adapter/factory/staff.factory';
import { DocDashboardMetricDTO, DocStaffDTO } from './doc.staff.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { BaseConfig } from 'config/base.config';
import { StaffGuard } from 'adapter/guard/auth.guard';
import { OStaff, Staff } from 'domain/model/staff.model';

@ApiTags('User as Staff management')
@UseGuards(StaffGuard)
@ApiBearerAuth()
@Controller('users')
export class StaffController {
  constructor(private readonly staffService: IStaffService) {}

  @Get()
  @ApiOperation({
    summary: 'Staff list',
    description: 'Fetch all users in the DB',
  })
  @ApiResponse({ type: DocStaffDTO, isArray: true })
  async all(@Query() param: UserQuerDTO): Promise<OStaff[]> {
    if (param && typeof param.ids === 'string') {
      const ids: string = param.ids;
      param.ids = ids?.split(',');
    }
    const users = await this.staffService.fetchAll(param);
    return users.map((client) => StaffFactory.getUser(client));
  }

  @Get('metric')
  @ApiOperation({
    summary: 'Métric du projet',
    description: 'Statistique concernant les adhérents et abonnements',
  })
  @ApiResponse({ type: DocDashboardMetricDTO, isArray: true })
  async metric(): Promise<BaseDashboardMetric> {
    
    return await this.staffService.getMetric();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'One Staff',
    description: 'Fetch user account by ID',
  })
  @ApiParam({
    type: String,
    name: 'id',
    description: 'ID of the needed clinic',
  })
  @ApiResponse({ type: DocStaffDTO })
  async show(@Param() { id }: IDParamDTO): Promise<OStaff> {
    return StaffFactory.getUser(await this.staffService.fetchOne(id));
  }

  /**
   * @method POST
   */

  @ApiExcludeEndpoint()
  @Post()
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiOperation({
    summary: 'Create account staff',
  })
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: BaseConfig.setFilePath,
        filename: BaseConfig.editFileName,
      }),
      fileFilter: BaseConfig.imageFileFilter,
    }),
  )
  async create(
    @Body() data: RegisterStaffDTO,
    @UploadedFile() file: any,
  ): Promise<OStaff | undefined> {
    data.avatar = file ? file.filename : undefined;
    data.password = DataGenerator.randomString();
    const client = await this.staffService.add(data);
    if (client)
      return { ...StaffFactory.getUser(client), password: data.password };
  }

  /**
   * @method PATCH
   */

  @Patch()
  @ApiOperation({ summary: 'Update client account' })
  @ApiBody({ type: UpdateClientDTO })
  @ApiResponse({ type: DocStaffDTO })
  async update(@Body() data: UpdateClientDTO): Promise<OStaff> {
    return StaffFactory.getUser(await this.staffService.edit(data));
  }

  @Patch('state')
  @ApiOperation({ summary: "Modification d'état des utilisateurs" })
  @ApiBody({
    type: IDsParamDTO,
    description: 'Id des utilisateurs concernés',
  })
  @ApiResponse({ type: Boolean })
  async setState(@Body() { ids }: IDsParamDTO): Promise<boolean> {
    if (ids) {
      if (ids && typeof ids === 'string') ids = [ids];
      return await this.staffService.setState(ids);
    }
    return false;
  }

  /**
   * @method DELETE
   */

  @ApiExcludeEndpoint()
  @Delete('clean')
  @ApiOperation({ summary: 'Clean removed Accounts' })
  @ApiResponse({ type: Boolean })
  clean(): Promise<boolean> {
    return this.staffService.clean();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove Account' })
  @ApiParam({
    type: String,
    name: 'id',
    description: 'ID of the client to remove',
  })
  @ApiResponse({ type: Boolean })
  remove(@Param() { id }: IDParamDTO): Promise<boolean> {
    return this.staffService.remove(id);
  }
}
