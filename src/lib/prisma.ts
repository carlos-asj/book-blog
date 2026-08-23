import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const connectionString = `${process.env.DATABASE_URL}`;

// Instancia o adapter com o driver do SQLite
const adapter = new PrismaBetterSqlite3({ url: connectionString });

// Passa o adapter na inicialização do PrismaClient
export const prisma = new PrismaClient({ adapter });