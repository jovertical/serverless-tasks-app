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
      .deleteOne({ _id: new ObjectId(id) });

    if (!result.acknowledged) {
      return json({ message: 'Task not deleted' }, 409);
    }

    return json(null, 204);
  } catch (error) {
    return json({ message: error.message }, 500);
  }
};
