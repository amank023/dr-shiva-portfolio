const serverless = require('serverless-http');
const app = require('../../backend/server');

const handler = serverless(app);

module.exports.handler = async (event, context) => {
  if (context) {
    context.callbackWaitsForEmptyEventLoop = false;
  }

  // Normalize path by stripping Netlify's internal function path
  // e.g. /.netlify/functions/api/appointments -> /api/appointments
  if (event.path) {
    let clean = event.path.replace(/^\/\.netlify\/functions\/api/, '');
    if (!clean.startsWith('/')) {
      clean = '/' + clean;
    }
    if (clean.startsWith('/api/api/')) {
      clean = clean.replace(/^\/api\/api\//, '/api/');
    }
    event.path = clean;
  }

  return await handler(event, context);
};
