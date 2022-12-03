import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

const name = 'weatherDate';

export const WEATHER_DATE_DEFAULT_FORMAT = 'DD.MM.YYYY';
dayjs.extend(customParseFormat);

@ValidatorConstraint({ name })
export class WeatherDateConstraint implements ValidatorConstraintInterface {
  validate(value: any, validationArguments?: ValidationArguments): boolean {
    const dateValue = dayjs(value, WEATHER_DATE_DEFAULT_FORMAT);

    return dateValue.isValid() && dateValue.isAfter(dayjs());
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    const { property, constraints } = validationArguments;
    const [format] = constraints;

    return `${property} should have format: ${format} and be after today`;
  }
}

export const WeatherDate =
  (format: string = WEATHER_DATE_DEFAULT_FORMAT, validationOptions?: ValidationOptions) =>
  (object: Record<string, any>, propertyName: string) => {
    registerDecorator({
      name,
      target: object.constructor,
      propertyName,
      constraints: [format],
      options: validationOptions,
      validator: WeatherDateConstraint,
    });
  };
