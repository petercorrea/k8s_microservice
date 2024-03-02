import cluster from 'cluster';
import os from 'os';
import process from 'process';
import app from './index.js';
import { getENV } from './utils/helpers.js';

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    console.log('Forking a new process...');
    cluster.fork();
  });
} else {
    app.listen({ port: 9000, host: '0.0.0.0' }).then(() => {
    console.log(`Env: ${getENV()}, PORT: ${process.env.PORT}`)
    console.log(`Worker ${process.pid} started`);
  });
}
