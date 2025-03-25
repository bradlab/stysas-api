/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ArgumentMetadata, ValidationPipe } from '@nestjs/common';
import { ObjectId } from 'mongodb';

export const toObjectId = (value: string | ObjectId): ObjectId => {
  return typeof value === 'string' ? new ObjectId(value) : value
}

export const manyToObjectId = (ids: string[]) => {
  if (ids?.length > 0) {
    return ids.map((id) => toObjectId(id));
  }
  return [];
}

export class CustomValidationPipe extends ValidationPipe {
  async transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type === 'body') {
      if (typeof value === 'object') {
        value = this.mapData(value);
      }

      if (Array.isArray(value)) {
        value.map((v) => {
          if (typeof v === 'object') return this.mapData(v);
          return v;
        });
      }
    }
    return value;
  }

  mapData(value: any) {
    // const regex = /\[.*?\]|{(.*?)}/;

    for (const key in value) {
      if (value[key] && typeof value[key] === 'string') {
        value[key] = this.jsonParser(value[key]);
        /* if (regex.test(value[key])) {
          value[key] = this.jsonParser(value[key]);
        } else if (!isNaN(parseInt(value[key]))) {
          value[key] = this.jsonParser(value[key]);
        } */
      }
    }
    return value;
  }

  jsonParser(value: string) {
    try {
      return JSON.parse(value);
    } catch (error) {
      return value;
    }
  }
}
