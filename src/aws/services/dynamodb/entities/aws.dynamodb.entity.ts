import { Utils } from '@utils/utils';
import { TDynamodbEntity } from '@aws/services/dynamodb/types/aws.dynamodb.types';

export abstract class AwsDynamodbEntity<TEntity extends TDynamodbEntity> {
  constructor(params?: Partial<TEntity>) {
    Utils.patchObject<Partial<TEntity>>(this, params, { ignoreUndefined: true });
  }
}
