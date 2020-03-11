const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

const typeDefs = gql`
  extend type Query {
    company(id: ID!): Company
  }

  type Company @key(fields: "id") {
    id: ID!
    name: String
    age: Int
    foo: Boolean
  }
`;

const resolvers = {
  Query: {
    company(_, { id }) {
      return companies.find(c => c.id === id);
    }
  },
  Company: {
    __resolveReference(object) {
      return companies.find(company => company.id === object.id);
    }
  }
};

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers
    }
  ])
});

server.listen({ port: process.env.PORT || 4005 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

const companies = [
  {
    id: "1",
    age: 13,
    name: "Bront Inc"
  },
  {
    id: "2",
    age: 13,
    name: "Justice for Harambe"
  },
  {
    id: "3",
    age: 13,
    name: "Nickelback fan club"
  }
];
