const express = require('express');
const health = require('@cloudnative/health-connect');
const client = require('prom-client');
const morgan = require('morgan');

const app = express();

// Middleware for logging HTTP requests
app.use(morgan('dev'));

// Health check setup
let healthcheck = new health.HealthChecker();

// Liveness check - usually just returns OK if the server is up
app.use('/live', health.LivenessEndpoint(healthcheck));

// Readiness check - checks if dependencies are ready (e.g., DB, external services)
let pingCheck = new health.PingCheck('example.com');
healthcheck.registerReadinessCheck(pingCheck);
app.use('/ready', health.ReadinessEndpoint(healthcheck));

// Metrics setup
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics(); // Collects default metrics from the Node.js process

// Custom counter example
const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'statusCode'],
});

// Middleware to count requests
app.use((req, res, next) => {
  res.on('finish', () => {
    httpRequestCounter.inc({
      method: req.method,
      route: req.route ? req.route.path : req.path,
      statusCode: res.statusCode,
    });
  });
  next();
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;

