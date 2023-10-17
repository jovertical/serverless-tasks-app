const { json } = require('./utils');
const mongodb = require('./utils/mongodb');

module.exports.all = async (event) => {
  const db = await mongodb();

  const tasks = await db.collection('tasks').find().toArray();

  return json(tasks);
};
