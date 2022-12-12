import { ValidationArguments } from 'class-validator';
import { WeatherDateConstraint } from './weather-date.validator';
import dayjs from 'dayjs';
import { WEATHER_DATE_DEFAULT_FORMAT } from '@workshop/lib-nest-weather-request';

let constraint: WeatherDateConstraint;

const commonBeforeEach = () => {
  constraint = new WeatherDateConstraint();
};

describe('validate', () => {
  beforeEach(commonBeforeEach);

  test('happy path. Correct format and date is after today', () => {
    const value = dayjs().add(1, 'days').format(WEATHER_DATE_DEFAULT_FORMAT);

    const result = constraint.validate(value, {
      constraints: [WEATHER_DATE_DEFAULT_FORMAT],
      value,
      targetName: '',
      property: 'test',
      object: { foo: value },
    });

    expect(result).toBeTruthy();
  });

  test('happy path. Incorrect format', () => {
    const value = dayjs().add(1, 'days').format('YYYY-MM-DD');

    const result = constraint.validate(value, {
      constraints: [WEATHER_DATE_DEFAULT_FORMAT],
      value,
      targetName: '',
      property: 'test',
      object: { foo: value },
    });

    expect(result).toBeFalsy();
  });

  test('happy path. Date is expired', () => {
    const value = dayjs().subtract(1, 'days').format(WEATHER_DATE_DEFAULT_FORMAT);

    const result = constraint.validate(value, {
      constraints: [WEATHER_DATE_DEFAULT_FORMAT],
      value,
      targetName: '',
      property: 'test',
      object: { foo: value },
    });

    expect(result).toBeFalsy();
  });
});

describe('defaultMessage', () => {
  const property = 'test';
  const format = WEATHER_DATE_DEFAULT_FORMAT;
  const validationArguments = <ValidationArguments>{
    property,
    constraints: [format],
  };

  beforeEach(commonBeforeEach);

  test('happy path', () => {
    const result = constraint.defaultMessage(validationArguments);

    expect(result).toBe(`${property} should have format: ${format} and be after today`);
  });
});
