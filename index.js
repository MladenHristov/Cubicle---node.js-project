const express = require("express");
const databaseConfig = require("./config/database");
const expressConfig = require("./config/express");
const routesConfig = require("./config/routes");

const storage = require("./middlewares/storage");
const logger = require("./middlewares/logger");

async function start() {
  //
  const port = 3000;
  const app = express();

  //app.use(logger());

  await databaseConfig(app);
  expressConfig(app);
  
  app.use(await storage());
  routesConfig(app);

  app.listen(port, () => {
    console.log(`Server is runnig on port ${port}`);
  });
}
start();
