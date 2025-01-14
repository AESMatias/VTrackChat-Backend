export const config = {
    jwtSecret: process.env.JWT_SECRET || 'default_jwt_secret',
    openaiApiKey: process.env.OPENAI_API_KEY || '',
  };