const { ApolloServer, gql } = require('apollo-server');
const { RESTDataSource } = require('apollo-datasource-rest');

const typeDefs = gql`
  type User {
    name: Name
    location: Location
    picture: Picture
    gender: String
    email: String
    phone: String
    nat: String
  }

  type Name {
    title: String
    first: String
    last: String
  }

  type Location {
    street: String
    city: String
    state: String
  }

  type Picture {
    large: String
    medium: String
    thumbnail: String
  }

  type Query {
    getUser: User
    getUsers(amount: Int): [User]
  }
`;

const resolvers = {
  Query: {
    getUser: (_, args, { dataSources }) => {
      return dataSources.randomUserAPI.getUser();
    },
    getUsers: (_, { amount }, { dataSources }) => {
      return dataSources.randomUserAPI.getUsers(amount);
    }
  }
};

class RandomUserAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://randomuser.me/api/';
  }

  async getUser() {
    const data = await this.get('/');
    return data.results[0];
  }

  async getUsers(amount = 10) {
    const data = await this.get(`/?results=${amount}`);
    return data.results;
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    randomUserAPI: new RandomUserAPI()
  }),
  introspection: true,
  playground: true
});

server.listen();
