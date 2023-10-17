const { ObjectId } = require('mongodb');
const { json } = require('./utils');
const mongodb = require('./utils/mongodb');

/**
 * @param {import('aws-lambda').APIGatewayEvent} event
 * @param {import('aws-lambda').Context} context
 */
module.exports.getAllTasks = async (event, context) => {
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

/**
 * @param {import('aws-lambda').APIGatewayEvent} event
 * @param {import('aws-lambda').Context} context
 */
module.exports.createTask = async (event, context) => {
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

/**
 * @param {import('aws-lambda').APIGatewayEvent} event
 * @param {import('aws-lambda').Context} context
 */
module.exports.updateTask = async (event, context) => {
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

/**
 * @param {import('aws-lambda').APIGatewayEvent} event
 * @param {import('aws-lambda').Context} context
 */
module.exports.deleteTask = async (event, context) => {
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

/**
 * @param {import('aws-lambda').APIGatewayEvent} event
 * @param {import('aws-lambda').Context} context
 */
module.exports.completeTask = async (event, context) => {
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
