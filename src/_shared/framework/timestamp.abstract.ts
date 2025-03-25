import { Prop } from '@nestjs/mongoose';

export abstract class ATimestamp {
  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({name: 'deleted_at'})
  deletedAt?: Date;
}
