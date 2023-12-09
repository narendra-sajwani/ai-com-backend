const { fetch } = require("cross-fetch");

const { ApolloClient, InMemoryCache, HttpLink } = require("@apollo/client");

let apolloClient;

const getApolloClient = (url) => {
  const link = new HttpLink({ uri: url, fetch: fetch });
  apolloClient = new ApolloClient({
    link,
    cache: new InMemoryCache(),
  });
  console.log("Apollo client", apolloClient.link.options);

  return apolloClient;
};

const getAddressQuery = (req, res) => {
  const graphQuery = `query profile {
        profile(request: {forHandle:"${req}"}) {
          id
          ownedBy {
            address
            chainId
          }
         
          onchainIdentity {
            ens {
              name
            }
          }
          handle {
            fullHandle
            id
          }
        }
      }
      `;

  return graphQuery;
};

const getCommonERC20Query = (req, ress) => {
  console.log(req);
  const graphQuery = `
  query MyQuery {
    TokenBalances(
      input: {filter: {owner: {_eq: "${req.receiver}"}, tokenType: {_eq: ERC20}}, blockchain: polygon}
    ) {
      TokenBalance {
        token {
          tokenBalances(
            input: {filter: {owner: {_eq: "${req.sender}"}, tokenType: {_eq: ERC20}}}
          ) {
            id
            token {
              address
              symbol
              name
            }
          }
        }
      }
    }
  }
  `;

  return graphQuery;
};

module.exports = { getApolloClient, getAddressQuery, getCommonERC20Query };
