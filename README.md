[![Coverage Status](https://coveralls.io/repos/github/frankly034/whitelist/badge.svg)](https://coveralls.io/github/frankly034/whitelist)

# Whitelist - An API resource that manages whtelisting of endpoint.

## Vision

Create an API resource to manage access to routes based on ip addresses. It is built using express and typescript with an object data storage.

---

## API Spec

The preferred JSON object to be returned by the API should be structured as follows:

### List of Whitelists (for listing whitelisted routes and ips)

```source-json
{
  "status": 200,
  "data": {
    "/protected": {
      "ips": [
          "127.0.0.1"
      ],
      "path": "/protected"
    },
    "/protected-2": {
      "ips": [
          "127.0.0.1"
      ],
      "path": "/protected"
    }
  }
}
```

### Errors and Status Codes

If a request fails any validations, expect errors in the following format:

```source-json
{
  "errors": [
    {
      "message": "Path is required",
      "field": "path"
    },
    {
      "message": "Invalid value",
      "field": "ip"
    },
    {
      "message": "Must be a valid IP address",
      "field": "ip"
    }
  ]
}
```

### Other status codes:

403 for Forbidden requests, when a request may be valid but the user doesn't have permissions to perform the action

404 for Not found requests, when a resource can't be found to fulfill the request

## Endpoints:

### List of Whitelists:

`GET /whitelists`

Example request body:

```source-json
{
  "status": 200,
  "data": {
    "/protected": {
      "ips": [
          "127.0.0.1"
      ],
      "path": "/protected"
    },
    "/protected-2": {
      "ips": [
          "127.0.0.1"
      ],
      "path": "/protected"
    }
  }
}
```

### Create Route Whitelist

`POST /whitelists`

Example request body:

```source-json
{
  "ip": "127.0.0.1",
  "path": "/protected"
}
```

### Remove a route from a list of whitelisted IP addresses for route

`POST /whitelists/remove`

Example request body:

```source-json
{
  "ip": "127.0.0.1",
  "path": "/protected"
}
```

### View protected route:

`GET /protected`

Example request success response:

```source-json
{
  "status": 200,
  "data": {
    "message": "Welcome to a protected route"
  }
}
```

Example request error response:

```source-json
{
  "errors": [
    {
      "message": "Forbidden"
    }
  ]
}
```

### Errors and Status Codes
If a request fails any validations, expect errors in the following format:

```source-json
{
  "errors": [
    {
      "message": "Path is required",
      "field": "path"
    },
    {
      "message": "Invalid value",
      "field": "ip"
    },
    {
      "message": "Must be a valid IP address",
      "field": "ip"
    }
  ]
}
```
