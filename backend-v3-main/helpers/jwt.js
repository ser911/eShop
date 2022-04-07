const expressJwt = require("express-jwt");

function authJwt() {
  const secret = process.env.secret;
  return expressJwt({
    secret,
    algorithms: ["HS256"],
  }).unless({
    path: [
     {
         url: /\/public\/uploads(.*)/,
         methods: ['GET', 'OPTIONS']
       },
      {
        url: /\/api\/v1\/products(.*)/,
        methods: ["GET", "OPTIONS"],
      },
      {
        url: /\/api\/v1\/categories(.*)/,
        methods: ["GET", "OPTIONS"],
      },
      {
        url: /\/api\/v1\/orders(.*)/,
        methods: ["GET", "OPTIONS", "POST"],
      },
      {
        url: /\/api\/v1\/variants(.*)/,
        methods: ["GET", "OPTIONS", "POST"],
      },
      {
        url: /\/api\/v1\/brands(.*)/,
        methods: ["GET", "OPTIONS", "POST"],
      },
      "/api/v1/users/login",
      "/api/v1/users/register",
    
    ],
  });
}

module.exports = authJwt;
