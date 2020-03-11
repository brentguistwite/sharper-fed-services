const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

const typeDefs = gql`
  extend type Query {
    user: [User]
  }

  type User @key(fields: "id") {
    id: ID!
    companyProfileID: String!
    name: String
    # avatar: String
  }

  extend type Company @key(fields: "id") {
    id: ID! @external
    users: [User]
  }
`;

const resolvers = {
  User: {
    __resolveReference(object) {
      return users.find(product => product.upc === object.upc);
    }
  },
  Query: {
    user() {
      return users;
    }
  },
  Company: {
    users(object) {
      return users.filter(u => u.companyProfileID === object.id);
    }
  }
};

const server = new ApolloServer({
  engine: false,
  subscriptions: false,
  reporting: false,
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers
    }
  ])
});

server.listen({ port: process.env.PORT || 4006 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

const users = [
  {
    id: "1",
    name: "Harambe",
    companyProfileID: "3"
  },
  {
    id: "2",
    name: "Brontly",
    companyProfileID: "2"
  },
  {
    id: "3",
    name: "Chad Champion",
    companyProfileID: "3"
  }
];
