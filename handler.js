const { json } = require('./utils');
const mongodb = require('./utils/mongodb');

/**
 * @param {import('aws-lambda').APIGatewayEvent} event
 * @param {import('aws-lambda').Context} context
 */
module.exports.getAllTasks = async (event, context) => {
  try {
    const db = await mongodb();

    const tasks = await db.collection('tasks').find().toArray();

    return json({ data: tasks });
  } catch (error) {
    return json({ message: error.message }, 500);
  }
};

/**
 * @param {object} event
 * @param {string} event.title
 * @param {string} event.description
 * @param {import('aws-lambda').Context} context
 */
module.exports.createTask = async (event, context) => {
  try {
    const db = await mongodb();

    const result = await db.collection('tasks').insertOne({
      title: event.title,
      description: event.description,
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
