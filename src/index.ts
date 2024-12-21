import { serverOf, serverStart } from "./server";

const port = 8888;

const server = serverOf();

serverStart(port)(server)
  .then(() => {
    console.log(`Server start successfully`);
  })
  .catch((error) => {
    console.log(`Failed to start server: ${error}`);
  });
