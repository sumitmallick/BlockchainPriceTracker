export default () => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    database: {
      url: process.env.DATABASE_URL,
    },
    moralis: {
      apiKey: process.env.MORALIS_API_KEY,
    },
    smtp: {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10),
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    priceTracking: {
      interval: 5 * 60 * 1000, // 5 minutes in milliseconds
      chains: ['ETH', 'MATIC'],
      alertThreshold: 3, // 3% price increase threshold
    },
  });