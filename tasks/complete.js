const { json } = require('../utils');
const mongodb = require('../utils/mongodb');

/**
 * @param {import('aws-lambda').APIGatewayEvent} event
 * @param {import('aws-lambda').Context} context
 */
module.exports.handler = async (event, context) => {
  try {
    const { id } = event.pathParameters;

    const db = await mongodb();

    const result = await db
      .collection('tasks')
      .updateOne({ _id: new ObjectId(id) }, { $set: { completed: true } });

    if (!result.acknowledged) {
      return json({ message: 'Task not completed' }, 409);
    }

    const task = await db
      .collection('tasks')
      .findOne({ _id: new ObjectId(id) });

    return json({ data: task });
  } catch (error) {
    return json({ message: error.message }, 500);
  }
};
