import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

let pool: any;
let db: any;

if (!process.env.DATABASE_URL) {
  if (process.env.NODE_ENV === 'production') {
    console.warn("⚠️ DATABASE_URL not set in production. App will run with limited functionality.");
    // Create a mock pool that doesn't crash the app
    pool = {
      query: () => Promise.resolve({ rows: [] }),
      end: () => Promise.resolve(),
    };
    db = { 
      select: () => ({ 
        from: () => ({ 
          where: () => [] 
        }) 
      }),
      insert: () => ({
        values: () => ({
          returning: () => [],
          onConflictDoUpdate: () => ({
            returning: () => []
          })
        })
      })
    };
  } else {
    throw new Error(
      "DATABASE_URL must be set. Did you forget to provision a database?",
    );
  }
} else {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle({ client: pool, schema });
}

export { pool, db };