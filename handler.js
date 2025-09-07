const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.createTask = async (event) => {
  const data = JSON.parse(event.body);
  const params = {
    TableName: 'Tasks',
    Item: {
      id: data.id,
      title: data.title,
      assignedTo: data.assignedTo,
      status: data.status
    }
  };

  try {
    await dynamoDb.put(params).promise();
    return { statusCode: 200, body: JSON.stringify(params.Item) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Could not create task' }) };
  }
};

module.exports.getTasks = async () => {
  const params = {
    TableName: 'Tasks'
  };

  try {
    const data = await dynamoDb.scan(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(data.Items)
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Could not retrieve tasks' }) };
  }
};

module.exports.updateTask = async (event) => {
  const data = JSON.parse(event.body);
  const params = {
    TableName: 'Tasks',
    Key: { id: event.pathParameters.id },
    UpdateExpression: 'set title = :title, assignedTo = :assignedTo, status = :status',
    ExpressionAttributeValues: {
      ':title': data.title,
      ':assignedTo': data.assignedTo,
      ':status': data.status
    }
  };

  try {
    await dynamoDb.update(params).promise();
    return { statusCode: 200, body: JSON.stringify({ message: 'Task updated successfully' }) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Could not update task' }) };
  }
};

module.exports.deleteTask = async (event) => {
  const params = {
    TableName: 'Tasks',
    Key: { id: event.pathParameters.id }
  };

  try {
    await dynamoDb.delete(params).promise();
    return { statusCode: 200, body: JSON.stringify({ message: 'Task deleted successfully' }) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Could not delete task' }) };
  }
};