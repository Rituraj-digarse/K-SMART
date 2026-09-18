import 'dotenv/config';
export const env={
 port:Number(process.env.PORT||5000), databaseUrl:process.env.DATABASE_URL||'', jwtSecret:process.env.JWT_SECRET||'dev-secret-change-me', jwtExpiresIn:process.env.JWT_EXPIRES_IN||'7d', otpExpiryMinutes:Number(process.env.OTP_EXPIRY_MINUTES||5), nodeEnv:process.env.NODE_ENV||'development', openAiKey:process.env.OPENAI_API_KEY||'', openAiModel:process.env.OPENAI_MODEL||'gpt-4o-mini', corsOrigin:process.env.CORS_ORIGIN||'*'
};
if(!env.databaseUrl) console.warn('DATABASE_URL is not set. Database-backed endpoints will fail until it is configured.');
