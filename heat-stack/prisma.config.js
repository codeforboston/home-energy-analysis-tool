export default {
  datasource: {
    provider: 'sqlite',
    url: { fromEnvVar: 'DATABASE_URL' },
  },
};
