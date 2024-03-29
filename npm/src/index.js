const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const { SetConf, GetAll, GetRoom, GetIp } = require('../src/db');
const cors = require('cors');
const Tesseract = require('tesseract.js');

const corsOptions = {
  origin: 'http://10.202.249.200:8100',
  credentials: true,
  optionSuccessStatus: 200,
};

const typeDefs = gql`
  type Configuration {
    key: String
    generic: String
    local: String
    recognizedLanguage: String
  }
  type Room {
    net: String
    country: String
  }
  type Query {
    take(generic: String, local: String): [Configuration]
    get(generic: String, local: String, tablet: String): String
    room: [Room]!
    ip: String
    supportedLanguages: [String]!
    
  }
  type Mutation {
    recognizeText(image: String!): Configuration!
  }
`;

const resolvers = {
  Query: {
    take: async (_, { generic, local }) => {
      const result = await SetConf(generic, local);
      console.log(result);  
      return result;
    },
    get: async (_, { generic, local, tablet}) => {
      const result = GetAll(generic, local, tablet);
      console.log(result);
      return result;
    },
    room: async () => {
      const result = await GetRoom();
      const sqlite3 = require('sqlite3').verbose();
      
      const db = new sqlite3.Database('test.db'); 
      const selectQuer = `DELETE FROM chat;`;
      db.all(selectQuer, (err, rows) => {
      db.close((err) => {
      if (err) {console.error('Error closing the database connection:', err.message);
      reject(err);
      };})}); 
      console.log(result);
      return result;
    },
    ip: async()=>{
      const result = await GetIp();
      console.log(result);
      return result;
    },
    supportedLanguages: () => Tesseract.getLanguages().map(lang => lang.lang),
  },
  Mutation: {
    recognizeText: async (_, { image }) => {
      try {
        const { data } = await Tesseract.recognize(Buffer.from(image, 'base64'), 'osd'); // Визначення мови за допомогою OSD (Orientation and Script Detection)
        const recognizedLanguage = data.script ? data.script : 'eng'; // Визначення мови для тексту
        const filteredText = data.text.replace(/[^a-zA-Zа-яА-ЯёЁ0-9\s]/g, ''); // Вилучення нерозпізнаних символів

        return {
          recognizedLanguage,
          key: 'exampleKey', // Замініть це значення на те, яке ви хочете повертати
          generic: 'exampleGeneric', // Замініть це значення на те, яке ви хочете повертати
          local: 'exampleLocal', // Замініть це значення на те, яке ви хочете повертати
          text: filteredText, // Додано фільтрований текст
        };
      } catch (error) {
        console.error('Помилка при розпізнаванні тексту:', error);
        throw new Error('Помилка при розпізнаванні тексту');
      }
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });
const app = express();

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://10.202.249.200:8100');
  res.header('Access-Control-Allow-Headers', true);
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  next();
});

async function startServer() {
  await server.start();

  server.applyMiddleware({ app });

  app.listen(5000,'10.202.249.200', () => {
    console.log(`Server is running at http://10.202.249.200:5000/graphql`);
  });

}

startServer();
