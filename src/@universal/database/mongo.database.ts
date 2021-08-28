import config from 'config';

const { MONGODB_URL } = config.get('config');

export const dbConnection = {
  url: MONGODB_URL,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
};
