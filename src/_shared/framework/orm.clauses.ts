/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { DeepQueryType, PartialDeep } from 'domain/types';

export const VMoreThan = <T>(v: T | DeepQueryType<T>) => {
  return {$gt: v};
};

export const VEqual = <T>(v: T | DeepQueryType<T>) => {
  return {$eq: v};
};

export const VLike = (v: string) => {
  return {$regex: v, $options: 'i'};
};

export const VILike = (v: string) => {
  return {$regex: v, $options: 'i'};
};

export const VBetween = <T>(a: T, b: T) => {
  return {$gte: a, $lte: b};
};

export const VIsNull = () => {
  return {$eq: null};
};

export const VIn = <T>(values: T[]) => {
  return {$in: values};
};

export const VNotIn = <T>(values: T[]) => {
  return {$nin: values};
};

export const VGreaterThan = <T>(value: T) => {
  return {$gt: value};
};

export const VGreaterThanOrEqual = <T>(value: T) => {
  return {$gte: value};
};

export const VLessThan = <T>(value: T) => {
  return {$lt: value};
};

export const VLessThanOrEqual = <T>(value: T) => {
  return {$lte: value};
};

export const VNotEqual = <T>(value: T) => {
  return {$ne: value};
};

// Exemple avec un opérateur logique $and
export const VAnd = (conditions: any[]) => {
  return {$and: conditions};
};

// Exemple avec un opérateur logique $or
export const VOr = (conditions: any[]) => {
  return {$or: conditions};
};

// Exemple avec un opérateur logique $not
export const VNot = (condition: any) => {
  return {$not: condition};
};
