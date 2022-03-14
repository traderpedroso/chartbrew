const { PaginateCursor } = require("../modules/paginateRequests");

function getConnectionOpt(connection, dr) {
  const options = {
    url: `${connection.host}/${dr.route}`,
    method: dr.method,
    headers: {
      "Accept": "application/json",
      "authorization": `Bearer ${connection.password}`,
    },
    json: true,
  };

  if (dr.method === "POST" || dr.method === "PUT") {
    options.headers["Content-Type"] = "application/json";
  }

  return options;
}

function getCustomers(connection, dr, filters) {
  const options = getConnectionOpt(connection, dr);
  options.url += "/customers";

  if (filters) {
    options.body = JSON.stringify(filters);
  }

  return PaginateCursor(options, dr.limit, "next", "start");
}

module.exports = {
  getConnectionOpt,
  getCustomers,
};