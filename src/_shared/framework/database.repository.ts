/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { IGenericRepository, RepoParam } from 'domain/abstract';
import { Model } from 'mongoose';

export class DBGenericRepository<T> implements IGenericRepository<T> {
  private _repository: Model<T>;

  constructor(repository: Model<T>) {
    this._repository = repository;
  }

  find(options?: any): Promise<T[]> {
    if (options?.where) {
      options = {...options.where, ...options, where: undefined};
    }
    const query = this._repository.find(this.convertWhere(options));
    return this.transformQueryToMongoose(query, options)
  }

  findBy(options: any): Promise<T[]> {
    return this._repository.find(options).exec();
  }

  async findOneByID(id: string, options?: any): Promise<T> {
    return await this._repository.findById(id).exec() ?? null as any;
  }

  async findByIds(ids: string[], options?: any): Promise<T[]> {
    const customQuery: any = { id: {$in: ids}, ...options };
    if (ids?.length > 0) {
      return await this._repository.find(customQuery).exec();
    }
    return [];
  }

  async findOne(options: any): Promise<T> {
    const optionQuery = this.convertWhere(options);
    return await this._repository.findOne(optionQuery).exec() ?? null as any;
  }

  async findForLogin(options: any): Promise<T> {
    return await this._repository.findOne({
      ...options,
      select: { ...options?.select, password: true },
    })  ?? null as any;
  }

  async findOneBy(options: any): Promise<T> {
    return await this._repository.findOne(options) ?? null as any;
  }

  async create(item: T): Promise<T> {
    return this._repository.create(item);
  }

  async createMany(items: T[]): Promise<T[]> {
    return this._repository.create(items);
  }

  async updateMany(items: T[]) : Promise<any> {
    const ids = items.map((item) => item['id']);
    return this._repository.updateMany({id: {$in: ids}}, items);
  }

  async update(item: T) : Promise<any> {
    return await this._repository.updateOne({id: item['id']}, item as any);
  }

  async clean(items: any): Promise<any> {
    // This method remove permanently
    return this._repository.deleteMany(items);
  }

  async removeMany(items: T[]): Promise<any> {
    return this._repository.deleteMany(items);
  }

  async remove(item: T): Promise<any> {
    return this._repository.deleteOne({id: item['id']});
  }

  private convertWhere(options: any) {
    let optionQuery: any;
    if (options?.where && Array.isArray(options.where)) {
      optionQuery = { $or: options.where };
    } else {
      optionQuery = options?.where ? options.where : {};
    }
    return optionQuery;
  }

  private async populateRecursive(
    query: any,
    relations: Record<string, any>
  ): Promise<any> {
    if (!relations) {
      return query;
    }
  
    for (const relation in relations) {
      if (relations[relation] === true) {
        query = query.populate(relation);
      } else {
        query = query.populate({
          path: relation,
          populate: await this.populateRecursive(
            query,
            relations[relation]
          ),
        });
      }
    }
  
    return query;
  }

  private async transformQueryToMongoose<T>(
    query: any,
    options: RepoParam<T>
  ): Promise<T[]> {
    try {
      // let query = this._repository.find(this.convertWhere(options.where) || {});
  
      // Gestion des relations (populate)
      if (options.relations) {
        query = await this.populateRecursive(query, options.relations as any);
        // for (const relation in options.relations as any) {
        //   if (options.relations[relation] === true) {
        //     query = query.populate(relation);
        //   } else {
        //     query = query.populate({
        //       path: relation,
        //       populate: options.relations[relation],
        //     });
        //   }
        // }
      }
  
      // Gestion de l'ordre de tri
      if (options.order) {
        query = query.sort(this.convertirOrderEnSort(options.order));
      }
  
      // Gestion des champs à sélectionner
      if (options.select) {
        query = query.select(options.select as any);
      }
  
      // Gestion de la pagination
      if (options.skip) {
        query = query.skip(options.skip);
      }
      if (options.take) {
        query = query.limit(options.take);
      }
  
      return await query.exec();
    } catch (error) {
      console.error('Erreur lors de la recherche des documents :', error);
      throw error;
    }
  }
  private convertirOrderEnSort(order: any): any {
    const sort: Record<string, 1 | -1> = {};
  
    for (const key in order) {
      // if (order[key] && typeof(order[key] !== 'string')) {
      //   sort[key] = this.convertirOrderEnSort(order[key]);
      // }
      sort[key] = order[key] === 'DESC' ? -1 : 1;
    }
  
    return sort;
  }
}
