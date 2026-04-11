export const envConfig = () => {
  return {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3002,
    mongodb: process.env.MONGODB,
    defaultLimit: process.env.DEFAULT_LIMIT || 10,
  };
};