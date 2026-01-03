// utils/prisma.ts

// Mantenha esta importação
import { PrismaClient } from "@prisma/client"; // Use '@prisma/client' em vez do caminho relativo longo

// NOVAS IMPORTAÇÕES NECESSÁRIAS:
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// 1. Configurar a Conexão
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  // É crucial garantir que a variável de ambiente exista
  throw new Error("DATABASE_URL não está definida no ambiente.");
}

// 2. Criar a Pool do driver 'pg'
const pool = new Pool({ 
    connectionString,
    // Adicione opções aqui se necessário (ex: ssl, max connections)
});

// 3. Criar o Adaptador do Prisma
const adapter = new PrismaPg(pool);


let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
    // Em produção, inicialize com o adapter
    prisma = new PrismaClient({
        adapter: adapter, // <--- MUDANÇA OBRIGATÓRIA AQUI!
        // opcional: adicione logs de query
        // log: ['query'],
    });
} else {
    // Em desenvolvimento (Singleton Global)
    let globalWithPrisma = global as typeof globalThis & { prisma: PrismaClient };
    
    if (!globalWithPrisma.prisma) {
        globalWithPrisma.prisma = new PrismaClient({
            adapter: adapter, // <--- MUDANÇA OBRIGATÓRIA AQUI!
            // opcional: adicione logs de query para debugging
            // log: ['query'], 
        });
    }

    prisma = globalWithPrisma.prisma;
}

export default prisma;