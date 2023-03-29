const express = require('express');
const path = require('path');

const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
// start express app
const app = express();

// 1. global middleware

// Set security https headers
// Helmet config

const scriptSrcUrls = [
  'https://api.tiles.mapbox.com/',
  'https://api.mapbox.com/',
  'https://cdnjs.cloudflare.com/ajax/libs/axios/0.18.0/axios.min.js',
  // 'ws://127.0.0.1:51230/',
  // 'ws://127.0.0.1:59569/',
  'ws://127.0.0.1:54970/',
  'https://js.stripe.com/v3/',
];
const styleSrcUrls = [
  'https://api.mapbox.com/',
  'https://api.tiles.mapbox.com/',
  'https://fonts.googleapis.com/',
  'https://cdnjs.cloudflare.com/ajax/libs/axios/0.18.0/axios.min.js',
  // 'ws://127.0.0.1:51230/',
  // 'ws://127.0.0.1:59569/',
  'ws://127.0.0.1:54970/',
  'https://js.stripe.com/v3/',
];
const connectSrcUrls = [
  'https://api.mapbox.com/',
  'https://a.tiles.mapbox.com/',
  'https://b.tiles.mapbox.com/',
  'https://events.mapbox.com/',
  'https://cdnjs.cloudflare.com/ajax/libs/axios/0.18.0/axios.min.js',
  // 'ws://127.0.0.1:51230/',
  // 'ws://127.0.0.1:59569/',
  'ws://127.0.0.1:54970/',
  'https://js.stripe.com/v3/',
];
const fontSrcUrls = [
  'fonts.googleapis.com',
  'fonts.gstatic.com',
];

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'self'", ...scriptSrcUrls],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        ...styleSrcUrls,
      ],
      workerSrc: ["'self'", 'blob:'],
      objectSrc: [],
      imgSrc: ["'self'", 'blob:', 'data:'],
      fontSrc: ["'self'", ...fontSrcUrls],
      frameSrc: ["'self'", 'https://js.stripe.com/'],
    },
  })
);

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Serving static file
app.use(express.static(path.join(__dirname, 'public')));

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message:
    'Too man request from this IP, please try again in an hour',
});

app.use('/api', limiter);

// Body parser, reading data from the body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(
  express.urlencoded({ extended: true, limit: '10kb' })
);
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Date snitization against XSS
app.use(xss());

// Prevent parament pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

//Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

// 3 ROUTES
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  next(
    new AppError(
      `Can't find ${req.originalUrl} on this server!`,
      404
    )
  );
});

app.use(globalErrorHandler);

module.exports = app;
