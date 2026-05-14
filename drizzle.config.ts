import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema/',
  dialect: 'postgresql',
  dbCredentials: {
    url: "postgresql://admin:ani31@localhost:5433/naas",
  },
});
