const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const http = require('http');
const morgan = require('morgan');
const authRouter = require('./api/auth/router.js');
const { errorMiddleware } = require('./middlewares/index');

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
  app.use(errorMiddleware);
});

app.get("/", (req, res) => {
  res.json("Hello World!!!");
})

process.on("unhandledRejection", (reason, p) => {
  logger.debug(
    `Unhandled Rejection at:  Promise ${p} reason: ${reason}`
  );
});