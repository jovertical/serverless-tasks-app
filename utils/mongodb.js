const { MongoClient, ServerApiVersion } = require('mongodb');

const URI = `mongodb+srv://jovertical:ypQZfstTosQmzWQZ@cluster0.riey2m4.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

module.exports = async () => {
  try {
    const connection = await client.connect();

    return connection.db('serverless-tasks-app');
  } catch (error) {
    await client.close();
  }
};
