const { json } = require('../utils');
const mongodb = require('../utils/mongodb');

/**
 * @param {import('aws-lambda').APIGatewayEvent} event
 * @param {import('aws-lambda').Context} context
 */
module.exports.handler = async (event, context) => {
  try {
    const input = JSON.parse(event.body);

    const db = await mongodb();

    const result = await db.collection('tasks').insertOne({
      title: input.title,
      description: input.description,
      completed: false,
    });

    if (!result.acknowledged) {
      return json({ message: 'Task not created' }, 409);
    }

    const task = await db
      .collection('tasks')
      .findOne({ _id: result.insertedId });

    return json({ data: task }, 201);
  } catch (error) {
    return json({ message: error.message }, 500);
  }
};
