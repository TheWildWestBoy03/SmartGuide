import express from 'express'
import {createProxyMiddleware} from 'http-proxy-middleware'
import cors from 'cors'

const app : express.Application = express()
const port : number = 3000;

const corsOptions = {
  origin: 'http://localhost:4200', 
  methods: 'GET,POST,UPDATE,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions))
app.use('/api/auth', createProxyMiddleware({
  target: 'http://auth-service:4000',
  changeOrigin: true,
  logLevel: 'debug',
  pathRewrite: { '^/api/auth': '' },
} as any));

app.use('/api/reviews', createProxyMiddleware({
  target: 'http://review-service:4100',
  changeOrigin: true,
  logLevel: 'debug',
  pathRewrite: { '^/api/reviews': '' },
} as any));

app.use('/api/routes-computing', createProxyMiddleware({
  target: 'http://routes-service:4300',
  changeOrigin: true,
  logLevel: 'debug',
  pathRewrite: {
    '^/api/routes': '',
  },
} as any))

app.listen(port, () => {console.log(`API Gateway listening on port ${port}`)})