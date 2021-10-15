# Trabajo páctico lambda

```bash
docker network create awslocal
docker run --rm -p 8000:8000 --network awslocal --name dynamodb amazon/dynamodb-local -jar DynamoDBLocal.jar -sharedDb
```

```bash
npm install
sam local start-api --docker-network awslocal
```

# Endpoints:

### GET /envios/pendientes

### PUT /envios/{idEnvio}/entregado

### POST /envios

### Body:

```bash
{
"destino": "Mendoza",
"email": "martinteppa@gmail.com",
}
```
