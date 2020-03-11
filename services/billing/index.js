const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

const typeDefs = gql`
  type CompanyService @key(fields: "name") {
    disableTimeStamp: String
    isAgencyControlled: Boolean
    isEnabled: Boolean
    name: String!
  }

  extend type Company @key(fields: "id") {
    id: ID! @external
    services: [CompanyService]
  }
`;

const resolvers = {
  Company: {
    __resolveReference(object) {
      return {
        ...object,
        services: data.filter(service => service.companyId === object.id)
      };
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

server.listen({ port: process.env.PORT || 4007 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

const data = [
  {
    companyId: "1",
    disableTimeStamp: "04/20/2069",
    isAgencyControlled: false,
    isEnabled: true,
    name: "chatbot"
  },
  {
    companyId: "1",
    disableTimeStamp: "04/20/2069",
    isAgencyControlled: true,
    isEnabled: true,
    name: "memes"
  },
  {
    companyId: "3",
    disableTimeStamp: "04/20/2069",
    isAgencyControlled: false,
    isEnabled: true,
    name: "reporting"
  },
  {
    companyId: "3",
    disableTimeStamp: "04/20/2069",
    isAgencyControlled: false,
    isEnabled: false,
    name: "memes"
  }
];
