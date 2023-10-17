const { json } = require('../utils');
const mongodb = require('../utils/mongodb');

/**
 * @param {import('aws-lambda').APIGatewayEvent} event
 * @param {import('aws-lambda').Context} context
 */
module.exports.handler = async (event, context) => {
  try {
    const input = JSON.parse(event.body);

    const { id } = event.pathParameters;

    const db = await mongodb();

    const result = await db
      .collection('tasks')
      .updateOne({ _id: new ObjectId(id) }, { $set: input });

    if (!result.acknowledged) {
      return json({ message: 'Task not updated' }, 409);
    }

    const task = await db
      .collection('tasks')
      .findOne({ _id: new ObjectId(id) });

    return json({ data: task });
  } catch (error) {
    return json({ message: error.message }, 500);
  }
};
