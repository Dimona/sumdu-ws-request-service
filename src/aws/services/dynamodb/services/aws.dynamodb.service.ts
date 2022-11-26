import { Inject, Injectable } from '@nestjs/common';
import { DocumentClientV3 } from '@typedorm/document-client';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { Connection, createConnection, EntityManager, getEntityManager } from '@typedorm/core';
import { AWS_DYNAMODB_CONFIG_OPTIONS } from '@aws/services/dynamodb/constants/aws.dynamodb.constants';
import { AwsDynamodbModuleOptions } from '@aws/services/dynamodb/types/aws.dynamodb.types';

@Injectable()
export class AwsDynamodbService {
  private readonly client: DynamoDBClient;
  private readonly documentClient: DocumentClientV3;

  constructor(@Inject(AWS_DYNAMODB_CONFIG_OPTIONS) private readonly options: AwsDynamodbModuleOptions) {
    this.client = new DynamoDBClient(options.client);
    this.documentClient = new DocumentClientV3(this.client);
    this.createConnections();
  }

  getOptions(): AwsDynamodbModuleOptions {
    return this.options;
  }

  getClient(): DynamoDBClient {
    return this.client;
  }

  getDocumentClient(): DocumentClientV3 {
    return this.documentClient;
  }

  getEntityManager(name?: string): EntityManager {
    return getEntityManager(name);
  }

  private createConnections(): void {
    Object.keys(this.options.connections).forEach(name => {
      createConnection({
        name,
        documentClient: this.documentClient,
        ...this.options.connections[name],
      });
    })
  }
}
