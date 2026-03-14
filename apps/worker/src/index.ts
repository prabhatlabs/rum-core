import { Hono } from 'hono';

const app = new Hono()

app.get('/health', (c) => {
  return c.text('Working!');
});

app.post('/', (c) => {
  const payload = c.req.json();

  console.log(payload);
  return c.text('got the request');
});

export default app
