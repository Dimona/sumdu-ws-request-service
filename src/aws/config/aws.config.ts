import { registerAs } from '@nestjs/config';
import { AWS_CONFIG } from '@aws/constants/aws.constants';
import { TAwsConfig } from '@aws/types/aws.types';

export const awsConfig = registerAs(
  AWS_CONFIG,
  () =>
    <TAwsConfig>{
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_DEFAULT_REGION,
    },
);
