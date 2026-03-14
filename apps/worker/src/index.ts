import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = new Hono()

app.use('/*', cors({
  origin: (origin) => origin,  // echo back whatever origin is requesting
  credentials: true,
}));

app.get('/health', (c) => {
  return c.text('Working!');
});

app.post('/', (c) => {
  const payload = c.req.json();

  console.log(payload);
  return c.text('got the request');
});

export default app
