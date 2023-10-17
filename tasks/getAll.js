const { json } = require('../utils');
const mongodb = require('../utils/mongodb');

/**
 * @param {import('aws-lambda').APIGatewayEvent} event
 * @param {import('aws-lambda').Context} context
 */
module.exports.handler = async (event, context) => {
  try {
    const db = await mongodb();

    const tasks = await db
      .collection('tasks')
      .find({ completed: false })
      .toArray();

    return json({ data: tasks });
  } catch (error) {
    return json({ message: error.message }, 500);
  }
};
