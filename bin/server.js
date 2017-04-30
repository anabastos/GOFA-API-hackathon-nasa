import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import convert from 'koa-convert'
import logger from 'koa-logger'
import mongoose from 'mongoose'
import session from 'koa-generic-session'
import passport from 'koa-passport'
import mount from 'koa-mount'
import serve from 'koa-static'
import cors from 'koa2-cors'

import config from '../config'
import { errorMiddleware } from '../src/middleware'

import { cronJob } from '../src/services/cron';

cronJob();

const app = new Koa()
app.keys = [config.session]

mongoose.Promise = global.Promise

if(!process.env.NODE_ENV)
  process.env.NODE_ENV = 'development';

if (process.env.NODE_ENV === 'development') 
  mongoose.connect(config.database)

if (process.env.NODE_ENV === 'production') {

  let options = {
    auth: {
      authdb: 'admin'
    }
  };

  function connectWithRetry() {
    return mongoose.connect(config.database, options, function (err) {
      if (err)
        setTimeout(connectWithRetry, 1000);
    });
  };
  connectWithRetry();
}

app.use(convert(logger()))
app.use(bodyParser())
app.use(session())
app.use(cors({
   origin: '*',
   methods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
   headers: ['Content-Type', 'Authorization']
}));
app.use(errorMiddleware())

app.use(convert(mount('/docs', serve(`${process.cwd()}/docs`))))

require('../config/passport')
app.use(passport.initialize())
app.use(passport.session())

const modules = require('../src/modules')
modules(app)

app.listen(config.port, () => {
  console.log(`Server started on ${config.port}`)
})

export default app
