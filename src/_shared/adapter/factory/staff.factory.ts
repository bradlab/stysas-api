import { HashFactory } from 'adapter/hash.factory';
import { DataHelper } from 'adapter/helper/data.helper';
import { IRegisterStaffDTO } from 'auth/auth.service.interface';
import { OStaff, Staff } from 'domain/model/staff.model';
import { IUpdateClientDTO } from 'manager/staff.service.interface';

export abstract class StaffFactory {
  static async create(data: IRegisterStaffDTO): Promise<Staff> {
    const user = new Staff();
    user.courriel = data.courriel;
    user.telephone = data.telephone;
    user.courriel = data.courriel;
    user.telephone = data.telephone;
    user.prenom = data.prenom;
    user.nom = data.nom;
    user.avatar = data.avatar;
    user.adresse = data.adresse;
    user.matricule = data.matricule;
    user.password = await HashFactory.hashPwd(data.password);
    user.isActivated = true;
    return user;
  }

  static update(user: Staff, data: IUpdateClientDTO): Staff {
    user.prenom = data.prenom ?? user.prenom;
    user.nom = data.nom ?? user.nom;
    user.adresse = data.adresse ?? user.adresse;
    user.matricule = data.matricule ?? user.matricule;
    user.avatar = data.avatar ?? user.avatar;
    user.courriel = data.courriel ?? user.courriel;
    user.telephone = data.telephone ?? user.telephone;

    return user;
  }

  static getUser(user: Staff): OStaff {
    if (user) {
      return {
        id: user.id,
        courriel: user.courriel,
        telephone: user.telephone,
        prenom: user.prenom,
        nom: user.nom,
        fullname: DataHelper.getFullName(user.prenom, user.nom),
        adresse: user.adresse,
        matricule: user.matricule,
        avatar: DataHelper.getFileLink(user.avatar!),
        isActivated: user.isActivated,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    }
    return null as any;
  }
}
