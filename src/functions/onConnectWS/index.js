const AWS = require('aws-sdk');
const dynamodbConverter = AWS.DynamoDB.Converter;

const ddb = new AWS.DynamoDB({
  apiVersion: '2012-08-10',
  region: process.env.AWS_REGION,
});

const { TABLE_NAME } = process.env;

const addConnection = (connectionId) => {
  let connectionItemUnmarshalled = {
    connectionId: `${connectionId}`,
  };
  let connectionItem = dynamodbConverter.marshall(connectionItemUnmarshalled);
  const putParams = {
    TableName: TABLE_NAME,
    Item: connectionItem,
  };

  return ddb.putItem(putParams).promise();
};

module.exports.main = async (event) => {
  let addConnectionResponse;

  try {
    addConnectionResponse = await addConnection(
      event.requestContext.connectionId
    );

    if (addConnectionResponse) {
    } else {
      console.log('reponse empty');
    }
  } catch (e) {
    return {
      status: 500,
      body: e.stack,
    };
  }

  return { statusCode: 200, body: 'Connected.' };
};
