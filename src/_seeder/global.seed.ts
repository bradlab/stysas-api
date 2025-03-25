import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import {
  IAdherentService,
  ICreateAdherentDTO,
} from 'adherent/adherent.service.interface';
import { Staff } from 'domain/model/staff.model';
import {
  ICreateEquipmentDTO,
  IEquipmentService,
} from 'equipment/equipment.service.interface';
import { ICreateSalleDTO, ISalleService } from 'salle/salle.service.interface';
import { IRegisterStaffDTO } from 'auth/auth.service.interface';
import { IStaffService } from 'manager/staff.service.interface';
import { SalleSport } from 'domain/model/salle.model';
import {
  ICreateHoraireDTO,
  IHoraireService,
} from 'horaire/horaire.service.interface';
import { ICreateEntraineurDTO, IEntraineurService } from 'entraineur/entraineur.service.interface';

@Injectable()
export class GlobalSeed implements OnApplicationBootstrap {
  private logger = new Logger();
  constructor(
    private readonly adminService: IStaffService,
    private readonly adherentService: IAdherentService,
    private readonly equipmentService: IEquipmentService,
    private readonly salleService: ISalleService,
    private readonly horaireService: IHoraireService,
    private readonly entraineurService: IEntraineurService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    this.createAdmin();
    this.createAdherents();
    this.createSalles();
    this.createHoraires();
    this.createCoachs();
  }

  async createAdmin() {
    try {
      const data: IRegisterStaffDTO = {
        courriel: 'admin.nosql@esgis.org',
        password: 'Azerty_10@8',
        prenom: 'Admin',
        nom: 'NoSQL',
        telephone: '+22893141414',
        adresse: 'Avedji, Lomé - Togo',
        matricule: 120,
      };
      let existed = await this.adminService.search({
        courriel: data.courriel,
        // matricule: data.matricule,
      });
      if (!existed)
        existed = await this.adminService.search({ matricule: data.matricule });
      if (!existed) {
        const staff = await this.adminService.add(data);
        this.logger.log('ADMIN ====== STAFF', {
          courriel: staff?.courriel,
          pwd: data.password,
        });
      }
    } catch (error) {
      this.logger.error(error.message, 'ERROR::GlobalSeed.createAdmin');
    }
  }

  async createAdherents() {
    try {
      const datas: ICreateAdherentDTO[] = [
        {
          matricule: 101,
          nom: 'Dupont',
          prenom: 'Jean',
          telephone: '0612345678',
          courriel: 'jean.dupont@esgis.com',
          adresse: '10 rue de la Paix, 75000 Paris',
          num_membre: 123,
          poids: 85,
        },
        {
          matricule: 102,
          nom: 'Martin',
          prenom: 'Sophie',
          telephone: '+22897104116',
          courriel: 'sophie.martin@esgis.com',
          adresse: '25 avenue des Champs-Élysées, 75008 Paris',
          num_membre: 456,
          poids: 62,
        },
        {
          matricule: 103,
          nom: 'Lefevre',
          prenom: 'Pierre',
          telephone: '+22822230022',
          courriel: 'pierre.lefevre@esgis.com',
          adresse: '5 rue du Louvre, 75001 Paris',
          num_membre: 789,
          poids: 90,
        },
        {
          matricule: 104,
          nom: 'Garcia',
          prenom: 'Marie',
          telephone: '+22870101120',
          courriel: 'marie.garcia@esgis.com',
          adresse: '15 boulevard Haussmann, 75009 Paris',
          num_membre: 101,
          poids: 70,
        },
        {
          matricule: 105,
          nom: 'Dubois',
          prenom: 'Luc',
          telephone: '+22896656563',
          courriel: 'luc.dubois@esgis.com',
          adresse: '3 rue de Rivoli, 75004 Paris',
          num_membre: 112,
          poids: 78,
        },
      ];
      const adherents = await this.adherentService.fetchAll();
      if (adherents.length === 0)
        return this.adherentService.bulk({} as Staff, datas);
    } catch (error) {
      this.logger.error(error.message, 'ERROR::GlobalSeed.createAdherents');
    }
  }

  async createSalles() {
    try {
      const datas: ICreateSalleDTO[] = [
        {
          numero_salle: 1,
          adresse_salle: '10 rue de la République, Paris',
          capacite: 150,
        },
        {
          numero_salle: 2,
          adresse_salle: '25 avenue des Sports, Lyon',
          capacite: 100,
        },
        {
          numero_salle: 3,
          adresse_salle: '5 boulevard des Athlètes, Marseille',
          capacite: 200,
        },
      ];
      const existedSalles = await this.salleService.fetchAll();
      if (existedSalles.length === 0) {
        const salles = await this.salleService.bulk({} as Staff, datas);
        for (let index = 0; index < salles.length; index++) {
          await this.createEquipments(salles[index], index);
        }
      } else {
        // for (let index = 0; index < existedSalles.length; index++) {
        //   await this.createEquipments(existedSalles[index], index);
        // }
      }
    } catch (error) {
      this.logger.error(error.message, 'ERROR::GlobalSeed.createSalles');
    }
  }

  async createEquipments(salle: SalleSport, index: number) {
    try {
      const datas: ICreateEquipmentDTO[] = [
        {
          num_equip: 1,
          nom_equip: 'Tapis de course',
          fonction_equip: 'Cardio',
          quantite: 5,
          salleID: salle.id,
        },
        {
          num_equip: 2,
          nom_equip: 'Vélo elliptique',
          fonction_equip: 'Cardio',
          quantite: 3,
          salleID: salle.id,
        },
        {
          num_equip: 3,
          nom_equip: 'Haltères',
          fonction_equip: 'Musculation',
          quantite: 20,
          salleID: salle.id,
        },
        {
          num_equip: 4,
          nom_equip: 'Barre de traction',
          fonction_equip: 'Musculation',
          quantite: 2,
          salleID: salle.id,
        },
        {
          num_equip: 5,
          nom_equip: 'Machine à leg press',
          fonction_equip: 'Musculation',
          quantite: 1,
          salleID: salle.id,
        },
        {
          num_equip: 6,
          nom_equip: 'Machine à butterfly',
          fonction_equip: 'Musculation',
          quantite: 1,
          salleID: salle.id,
        },
        {
          num_equip: 7,
          nom_equip: 'Banc de musculation',
          fonction_equip: 'Musculation',
          quantite: 4,
          salleID: salle.id,
        },
        {
          num_equip: 8,
          nom_equip: 'Tapis de yoga',
          fonction_equip: 'Fitness',
          quantite: 15,
          salleID: salle.id,
        },
        {
          num_equip: 9,
          nom_equip: 'Ballon de pilates',
          fonction_equip: 'Fitness',
          quantite: 10,
          salleID: salle.id,
        },
        {
          num_equip: 10,
          nom_equip: 'Corde à sauter',
          fonction_equip: 'Cardio',
          quantite: 8,
          salleID: salle.id,
        },
        {
          num_equip: 11,
          nom_equip: 'Rameur',
          fonction_equip: 'Cardio',
          quantite: 3,
          salleID: salle.id,
        },
        {
          num_equip: 12,
          nom_equip: 'Kettlebell',
          fonction_equip: 'Musculation',
          quantite: 6,
          salleID: salle.id,
        },
      ];
      // this.equipmentService.bulk({} as Staff, tablePartRandomly(datas));

      this.equipmentService.bulk(
        {} as Staff,
        datas.slice(index * 4, (index + 1) * 4),
      );
    } catch (error) {
      this.logger.error(error.message, 'ERROR::GlobalSeed.createEquipments');
    }
  }

  async createHoraires() {
    try {
      const datas: ICreateHoraireDTO[] = [
        {
          debut: 7.3,
          fin: 10.3,
        },
        {
          debut: 8.3,
          fin: 10,
        },
        {
          debut: 14,
          fin: 16,
        },
        {
          debut: 15,
          fin: 17,
        },
        {
          debut: 17.3,
          fin: 18.45,
        },
        {
          debut: 19.3,
          fin: 21,
        },
      ];
      const existedHoraires = await this.horaireService.fetchAll();
      if (existedHoraires.length === 0) this.horaireService.bulk(datas);
    } catch (error) {
      this.logger.error(error.message, 'ERROR::GlobalSeed.createEquipments');
    }
  }

  async createCoachs() {
    try {
      const datas: ICreateEntraineurDTO[] = [
        {
          matricule: 1002,
          nom: 'Martin',
          prenom: 'Sophie',
          telephone: '+22893303020',
          courriel: 'sophie.martin@email.com',
          adresse: '25 avenue des Champs-Élysées, Paris',
          date_emb: new Date('2023-02-15T00:00:00.000Z'),
          specialite: 'Cardio',
          num_coach: 101,
          sal_base: 2800,
        },
        {
          matricule: 1003,
          nom: 'Lefevre',
          prenom: 'Pierre',
          telephone: '+22876235225',
          courriel: 'pierre.lefevre@email.com',
          adresse: '5 rue du Louvre, Paris',
          date_emb: new Date('2022-10-10T00:00:00.000Z'),
          specialite: 'Yoga',
          num_coach: 102,
          sal_base: 2300,
        },
        {
          matricule: 1004,
          nom: 'Garcia',
          prenom: 'Marie',
          telephone: '+22897875441',
          courriel: 'marie.garcia@email.com',
          adresse: '15 boulevard Haussmann, Paris',
          date_emb: new Date('2023-04-01T00:00:00.000Z'),
          specialite: 'Pilates',
          num_coach: 103,
          sal_base: 2600,
        },
        {
          matricule: 1007,
          nom: 'Okonkwo',
          prenom: 'Chinua',
          telephone: '+22872336655',
          courriel: 'chinua.okonkwo@example.com',
          adresse: '5 rue de la Paix, Lagos',
          date_emb: new Date('2022-10-10T00:00:00.000Z'),
          specialite: 'Yoga',
          num_coach: 104,
          sal_base: 2300,
        },
      ];
      const existedEntraineurs = await this.entraineurService.fetchAll();
      if (existedEntraineurs.length === 0) this.entraineurService.bulk(datas);
    } catch (error) {
      this.logger.error(error.message, 'ERROR::GlobalSeed.createEquipments');
    }
  }
}
