const { ApolloServer } = require("apollo-server");
const { ApolloGateway } = require("@apollo/gateway");

const { ENGINE_API_KEY, NODE_ENV, PORT, VARIANT } = process.env;

const gateway = new ApolloGateway({
  engine: {
    apiKeyHash: ENGINE_API_KEY,
    graphId: "bronts-graph"
  },
  exposeQueryPlan: true
});

const localGateway = new ApolloGateway({
  serviceList: [
    { name: "Account", url: "http://localhost:4001/graphql" },
    { name: "Review", url: "http://localhost:4002/graphql" },
    { name: "Product", url: "http://localhost:4003/graphql" },
    // { name: "Product", url: "https://bront-product-service.herokuapp.com/" },
    { name: "Inventory", url: "http://localhost:4004/graphql" },
    { name: "Company", url: "http://localhost:4005/graphql" },
    { name: "User", url: "http://localhost:4006/graphql" },
    { name: "Billing", url: "http://localhost:4007/graphql" }
  ]
});

const server = new ApolloServer({
  engine: {
    schemaTag: VARIANT || "current"
  },
  gateway: NODE_ENV !== "production" ? gateway : localGateway,
  subscriptions: false,
  introspection: true,
  playground: true
});

server.listen({ port: PORT || 4000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
