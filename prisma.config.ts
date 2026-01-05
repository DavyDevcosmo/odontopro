// ...existing code...
export default {
  datasources: [
    {
      url: process.env.DATABASE_URL,
      adapter: 'postgresql',
    },
  ],
}