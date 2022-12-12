module.exports = {
  tables: [
    {
      TableName: 'ws-weather-weather-requests-test',
      KeySchema: [
        { AttributeName: 'id', KeyType: 'HASH' },
        { AttributeName: 'targetDate', KeyType: 'RANGE' },
      ],
      AttributeDefinitions: [
        { AttributeName: 'id', AttributeType: 'S' },
        { AttributeName: 'targetDate', AttributeType: 'S' },
        { AttributeName: 'status', AttributeType: 'S' },
        { AttributeName: 'nextTime', AttributeType: 'N' },
      ],
      ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
      GlobalSecondaryIndexes: [
        {
          IndexName: 'status-nextTime-index',
          KeySchema: [
            { AttributeName: 'status', AttributeType: 'S', KeyType: 'HASH' },
            { AttributeName: 'nextTime', AttributeType: 'N', KeyType: 'RANGE' },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
        },
      ],
      data: [],
    },
  ],
  basePort: 8009,
};
