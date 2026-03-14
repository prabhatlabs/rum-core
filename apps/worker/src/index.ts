import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { saveBulkEvents } from './controllers/events';

const app = new Hono()

app.use('/*', cors({
  origin: (origin) => origin,  // echo back whatever origin is requesting
  credentials: true,
}));

app.get('/health', (c) => {
  return c.text('Working!');
});

app.post('/', saveBulkEvents);

export default app
