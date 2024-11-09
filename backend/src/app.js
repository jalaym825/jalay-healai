import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import http from 'http';
import morgan from 'morgan';
import authRouter from './api/auth/router.js';

const app = express();
const server = http.createServer(app);

app.use(morgan("[:date[clf]] :method :url :status :res[content-length] - :response-time ms"));

app.use(cors({
  origin: ['http://localhost:5173'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
}));

app.use(express.json());
app.use(helmet());
app.use(cookieParser());
const port = process.env.PORT || 3000;


server.listen(port, () => {
  console.log(`Worker ${process.pid} is listening on port ${port}`);
  app.use('/auth', authRouter);
});

app.get("/", (req, res) => {
  res.json("Hello World!!!");
})

process.on("unhandledRejection", (reason, p) => {
  logger.debug(
    `Unhandled Rejection at:  Promise ${p} reason: ${reason}`
  );
});