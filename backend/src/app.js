const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const http = require('http');
const morgan = require('morgan');
const authRouter = require('./api/auth/router.js');
const appointmentRouter = require('./api/appointment/router.js');
const forumRouter = require('./api/forum/router.js');
const { errorMiddleware } = require('./middlewares/index');
const { Prisma } = require('./utils/index');
const logger = require('./utils/logger.js');
const prescriptionRouter = require('./api/prescription/router.js');
const razorPayRouter = require('./api/razorpay/router.js')

const app = express();
const server = http.createServer(app);

app.use(morgan("[:date[clf]] :method :url :status :res[content-length] - :response-time ms"));

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://37.27.81.8:3030'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
}));

app.use(express.json());
app.use(helmet());
app.use(cookieParser());
const port = process.env.PORT || 3000;


server.listen(port, () => {
  console.log(`Worker ${process.pid} is listening on port ${port}`);
  Prisma.$connect().then(() => {
    console.log('Connected to Database');
    app.use('/auth', authRouter);
    app.use('/appointment', appointmentRouter);
    app.use('/forums', forumRouter);
    app.use('/prescription', prescriptionRouter);
    app.use('/razorpay', razorPayRouter);
    app.use(errorMiddleware);
  })
});

app.get("/", (req, res) => {
  res.json("Hello World!!!");
})

process.on("unhandledRejection", (reason, p) => {
  logger.debug(
    `Unhandled Rejection at:  Promise ${p} reason: ${reason}`
  );
});