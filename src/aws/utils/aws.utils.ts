import { default as Aws } from 'aws-sdk';
import { Logger } from '@nestjs/common';
import { ConfigurationOptions } from 'aws-sdk/lib/config-base';
import { ConfigurationServicePlaceholders } from 'aws-sdk/lib/config_service_placeholders';
import { APIVersions } from 'aws-sdk/lib/config';

export class AwsUtils {
  static configure(
    params: ConfigurationOptions & ConfigurationServicePlaceholders & APIVersions & { [key: string]: any },
  ): void {
    try {
      Aws.config.update(params);
    } catch (e) {
      Logger.error(e.message, e.stack, 'AWS Serverless');
    }
    return;
  }

  static setRegion(region?: string): string | undefined {
    try {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      let _region = region;
      if (!region) {
        _region = process.env.AWS_REGION;
      }

      if (_region) {
        Aws.config.update({ region: _region });
      }

      return _region;
    } catch (e) {
      Logger.error(e.message, e.stack, 'AWS Serverless');
    }
    // @ts-ignore
    return;
  }
}
