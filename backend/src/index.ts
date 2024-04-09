import { Hono } from 'hono';
import userRoutes from './routes/user';
import blogRoutes from './routes/blog';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string
  }
}>().basePath('/api/v1')

app.use(logger());
app.use(cors())

// User Routes
app.route('/', userRoutes);

// Blog Routes
app.route('/blog', blogRoutes);

export default app
