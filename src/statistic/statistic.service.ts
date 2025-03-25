import {
  Logger,
  Injectable,
} from '@nestjs/common';

import { BaseDashboardMetric, IStatisticService } from './statistic.service.interface';
import { IDashboardRepository } from 'adapter/database/dashboard.repository';

@Injectable()
export class StatisticService implements IStatisticService {
  private readonly logger = new Logger();
  constructor(
    private dashboardRepository: IDashboardRepository,
  ) {}

  async getMetric(): Promise<BaseDashboardMetric> {
    try {
      const subscriptions = await this.dashboardRepository.subscriptions.find({
        where: {actif: true},
        order: {createdAt: 'ASC'}
      });
      const adherents = await this.dashboardRepository.adherents.find();
      const coachs = await this.dashboardRepository.coachs.find();
      const salles = await this.dashboardRepository.salles.find();
      const carrieres = await this.dashboardRepository.carrieres.find();
      const equipements = await this.dashboardRepository.equipments.find();
      return {
        adherents: adherents.length,
        abonnements: subscriptions.length,
        equipements: equipements.length,
        carrieres: carrieres.length,
        salles: salles.length,
        coachs: coachs.length
      }
    } catch (error) {
      this.logger.error(error, 'ERROR::StaffService.fetchAll');
      throw error;
    }
  }
}
