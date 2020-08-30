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
  let connectionData;

  try {
    connectionData = await ddb
      .scan({ TableName: TABLE_NAME, ProjectionExpression: 'connectionId' })
      .promise();
  } catch (e) {
    return { statusCode: 500, body: e.stack };
  }

  const apigwManagementApi = new AWS.ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    endpoint:
      event.requestContext.domainName + '/' + event.requestContext.stage,
  });

  let postData;
  try {
    postData = JSON.parse(event.body).data;
  } catch (e) {
    return {
      statusCode: 500,
      body: e.stack,
    };
  }

  const postCalls = connectionData.Items.map(async (connectionItem) => {
    try {
      let { connectionId } = dynamodbConverter.unmarshall(connectionItem);
      await apigwManagementApi
        .postToConnection({ ConnectionId: connectionId, Data: postData })
        .promise();
    } catch (e) {
      if (e.statusCode === 410) {
        console.log(`Found stale connection, deleting ${connectionId}`);
        await ddb
          .delete({ TableName: TABLE_NAME, Key: { connectionId } })
          .promise();
      } else {
        throw e;
      }
    }
  });

  try {
    await Promise.all(postCalls);
  } catch (e) {
    return { statusCode: 500, body: e.stack };
  }

  return { statusCode: 200, body: 'Data sent.' };
};
