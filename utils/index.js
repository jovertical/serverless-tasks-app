const json = (data, statusCode = 200) => {
  return {
    statusCode,
    body: JSON.stringify(data),
  };
};

module.exports = {
  json,
};
