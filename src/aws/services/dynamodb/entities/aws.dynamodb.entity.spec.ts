import { AwsDynamodbEntity } from './aws.dynamodb.entity';

type TestEntity = {
  foo: string;
  bar: string;
};

class TestAwsDynamoDbEntity extends AwsDynamodbEntity<TestEntity> {}

test('constructor', () => {
  const entity = <TestEntity>{ foo: 'foo', bar: 'bar' };
  const values = { ...entity, undef: undefined };

  const result = new TestAwsDynamoDbEntity(values);

  expect(result).toEqual(entity);
});
