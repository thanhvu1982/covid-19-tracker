import { config } from 'dotenv';
config();

import express from 'express';
import cors from 'cors';
import vietnamRoute from './routers/vietnam.route';

const { loadNuxt, build } = require('nuxt');
const isDev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 5000;

async function start() {
  const app = express();

  app.use('/api/vietnam', vietnamRoute);

  const nuxt = await loadNuxt(isDev ? 'dev' : 'start');
  if (isDev) {
    build(nuxt);
    app.use(cors());
  }
  app.use(nuxt.render);

  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log('Server ready on port ' + port);
  });
}

start();