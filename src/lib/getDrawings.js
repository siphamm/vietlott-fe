const AWS = require('aws-sdk');

async function asyncGetDrawings(type) {
  const dynamoDb = new AWS.DynamoDB.DocumentClient({
    region: 'us-west-2'
  });
  const typeToTable = {
    vietlott645: 'vietlott645-results',
    vietlott655: 'vietlott655-results'
  };

  const params = {
    TableName: typeToTable[type],
    ProjectionExpression: '#id, #date, #result',
    ExpressionAttributeNames: {
      '#id': 'drawingId',
      '#date': 'drawingDate',
      '#result': 'drawingResult'
    }
  };

  return new Promise((resolve, reject) => {
    dynamoDb.scan(params, (err, data) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }

      const {Items: items} = data;

      items.sort((a, b) => {
        if (a.drawingDate > b.drawingDate) {
          return 1;
        } else if (a.drawingDate < b.drawingDate) {
          return -1;
        }

        return 0;
      });

      resolve(items);
    });
  });
}

module.exports = asyncGetDrawings;
