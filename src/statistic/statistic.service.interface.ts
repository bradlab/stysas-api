export interface BaseDashboardMetric {
  adherents?: number;
  abonnements?: number;
  salles?: number;
  coachs?: number;
  equipements?: number;
  carrieres?: number;
}

export abstract class IStatisticService {
  abstract getMetric(): Promise<BaseDashboardMetric>;
}
