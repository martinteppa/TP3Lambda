let response;
const uuidv4 = require("uuid/v4");

var AWS = require("aws-sdk");

var dynamodb = new AWS.DynamoDB({
  apiVersion: "2012-08-10",
  endpoint: "http://dynamodb:8000",
  region: "us-west-2",
  credentials: {
    accessKeyId: "2345",
    secretAccessKey: "2345",
  },
});
var docClient = new AWS.DynamoDB.DocumentClient({
  apiVersion: "2012-08-10",
  service: dynamodb,
});

exports.get = async (event, context) => {
  var consulta = {
    TableName: "Envio",
    IndexName: "EnviosPendientesIndex",
  };
  results = docClient.scan(consulta).promise();
  response = results
    .then((data) => {
      var devol = [];
      data.Items.forEach((thing) => {
        var aux = JSON.stringify(thing);
        devol.push(aux);
      });
      if (devol.length > 0) {
        return {
          statusCode: 200,
          body: JSON.parse(JSON.stringify(devol)),
        };
      } else {
        return {
          statusCode: 400,
          body: JSON.stringify({
            message: "No hay ningun envio pendiente en este momento",
          }),
        };
      }
    })
    .catch((err) => {
      console.log("Error: ", err);
    });
  return response;
};

exports.put = async (event, context) => {
  var params = {
    TableName: "Envio",
    Key: {
      id: event.pathParameters.idEnvio,
    },
  };

  rel = docClient.update(params).promise();
  response = rel
    .then(() => {
      return {
        statusCode: 200,
        body: JSON.stringify({ id: event.pathParameters.idEnvio }),
      };
    })
    .catch((err) => {
      console.log("Error: ", err);
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "No existe envio con ese id",
        }),
      };
    });
  return response;
};

exports.post = async (event, context) => {
  var puts = {
    TableName: "Envio",
    Item: {
      id: uuidv4(),
      fechaAlta: new Date().toISOString(),
      destino: JSON.parse(event.body).destino,
      email: JSON.parse(event.body).email,
      pendiente: "Si",
    },
  };

  results = docClient.put(puts).promise();
  response = results
    .then(() => {
      return {
        statusCode: 201,
        body: JSON.stringify(puts),
      };
    })
    .catch((err) => {
      console.log(err);
      return {
        statusCode: 409,
        body: JSON.stringify({ error: "envio fallido" }),
      };
    });
  return response;
};
