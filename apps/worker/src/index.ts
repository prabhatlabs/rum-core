import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { ingestPageVitals, ingestRequestEvents } from './controllers/events';
import { validateRequest } from './middlewares/vaidation';

const app = new Hono()

app.use('/*', cors({
  origin: (origin) => origin,  // echo back whatever origin is requesting
  credentials: true,
}));

app.get('/health', (c) => {
  return c.text('Working!');
});

app.use(validateRequest);
app.post('/ingest/events', ingestRequestEvents);
app.post('/ingest/vitals', ingestPageVitals);

export default app
