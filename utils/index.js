const json = (data, statusCode = 200) => {
  return {
    statusCode,
    body: JSON.stringify({ data }, null, 2),
  };
};

module.exports = {
  json,
};
