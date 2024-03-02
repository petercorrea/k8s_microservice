import cluster from 'cluster';
import os from 'os';
import process from 'process';
import app from './index.js';
import { configure_environment } from './utils/helpers.js';

const CPU_COUNT = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  for (let i = 0; i < CPU_COUNT; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    console.log('Forking a new process...');
    cluster.fork();
  });
} else {
  app.listen({ port: 9000, host: '0.0.0.0' }, (err, address) => {
    if (err != null) {
      app.log.error(err);
      process.exit(1);
    }

    const { ENV } = configure_environment();
    console.log(`Initializing cluster...`);
    console.log(`Environment set: ${ENV}`);
    console.log(`Server listening on ${address}`);
    console.log(`Worker ${process.pid} started`);
  });
}
