import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { DBGenericRepository } from 'framework/database.repository';
import { IGenericRepository } from '../../domain/abstract';
import { SubscriptionEntity } from '../../framework/schema/subscription.entity';
import { AdherentEntity } from '../../framework/schema/adherent.entity';
import { Adherent } from 'domain/model/adherent.model';
import { SalleSport } from 'domain/model/salle.model';
import { Staff } from 'domain/model/staff.model';
import { Abonnement } from 'domain/model/subscription.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Entraineur } from 'domain/model/coach.model';
import { Disponibilite } from 'domain/model/disponibilite.model';
import { Horaire } from 'domain/model/horaire.model';
import { Carriere } from 'domain/model/carriere.model';
import { Equipement } from 'domain/model/equipment.model';
import { EntraineurEntity } from 'framework/schema/entraineur.entity';
import { StaffEntity } from 'framework/schema/staff.entity';
import { SalleSportEntity } from 'framework/schema/salle.entity';
import { HoraireEntity } from 'framework/schema/horaire.entity';
import { DisponibiliteEntity } from 'framework/schema/disponibilite.entity';
import { CarriereEntity } from 'framework/schema/carriere.entity';
import { EquipementEntity } from 'framework/schema/equipment.schema';

export abstract class IDashboardRepository {
  users: IGenericRepository<Staff>;
  adherents: IGenericRepository<Adherent>;
  disponibilites: IGenericRepository<Disponibilite>;
  horaires: IGenericRepository<Horaire>;
  carrieres: IGenericRepository<Carriere>;
  equipments: IGenericRepository<Equipement>;
  coachs: IGenericRepository<Entraineur>;
  salles: IGenericRepository<SalleSport>;
  subscriptions: IGenericRepository<Abonnement>;
}

@Injectable()
export class DashboardRepository
  implements IDashboardRepository, OnApplicationBootstrap
{
  users: DBGenericRepository<StaffEntity>;
  adherents: DBGenericRepository<AdherentEntity>;
  coachs: DBGenericRepository<EntraineurEntity>;
  salles: DBGenericRepository<SalleSportEntity>;
  subscriptions: DBGenericRepository<SubscriptionEntity>;
  horaires: DBGenericRepository<HoraireEntity>;
  disponibilites: DBGenericRepository<DisponibiliteEntity>;
  carrieres: DBGenericRepository<CarriereEntity>;
  equipments: DBGenericRepository<EquipementEntity>;

  constructor(
    @InjectModel(StaffEntity.name)
    private staffRepository: Model<StaffEntity>,

    @InjectModel(AdherentEntity.name)
    private clientRepository: Model<AdherentEntity>,

    @InjectModel(EntraineurEntity.name)
    private coachRepository: Model<EntraineurEntity>,

    @InjectModel(SalleSportEntity.name)
    private prestationRepository: Model<SalleSportEntity>,

    @InjectModel(SubscriptionEntity.name)
    private storeRepository: Model<SubscriptionEntity>,

    @InjectModel(HoraireEntity.name)
    private horaireRepository: Model<HoraireEntity>,

    @InjectModel(DisponibiliteEntity.name)
    private disponibiliteRepository: Model<DisponibiliteEntity>,

    @InjectModel(CarriereEntity.name)
    private carriereRepository: Model<CarriereEntity>,

    @InjectModel(EquipementEntity.name)
    private equipementRepository: Model<EquipementEntity>,
  ) {}

  onApplicationBootstrap(): void {
    this.users = new DBGenericRepository<StaffEntity>(this.staffRepository);
    this.adherents = new DBGenericRepository<AdherentEntity>(this.clientRepository);
    this.salles = new DBGenericRepository<SalleSportEntity>(this.prestationRepository);
    this.coachs = new DBGenericRepository<EntraineurEntity>(
      this.coachRepository,
    );
    this.subscriptions = new DBGenericRepository<SubscriptionEntity>(this.storeRepository);
    this.horaires = new DBGenericRepository<HoraireEntity>(this.horaireRepository);
    this.disponibilites = new DBGenericRepository<DisponibiliteEntity>(this.disponibiliteRepository);
    this.carrieres = new DBGenericRepository<CarriereEntity>(this.carriereRepository);
    this.equipments = new DBGenericRepository<EquipementEntity>(this.equipementRepository);
  }
}
