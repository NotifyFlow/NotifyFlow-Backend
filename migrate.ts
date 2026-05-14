import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const DRIZZLE_DIR = path.join(process.cwd(), "drizzle");

const files = fs
  .readdirSync(DRIZZLE_DIR)
  .filter((file) => file.endsWith(".sql"))
  .sort();

for (const file of files) {
  const fullPath = path.join(DRIZZLE_DIR, file);

  console.log(`Running migration: ${file}`);

  const sql = fs.readFileSync(fullPath, "utf8");

  execSync(
    `docker exec -i naas-postgres psql -U admin -d naas`,
    {
      input: sql,
      stdio: ["pipe", "inherit", "inherit"],
    }
  );
}

console.log("All migrations executed.");