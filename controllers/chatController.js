const { gql } = require("@apollo/client");
const {
  getApolloClient,
  getAddressQuery,
  getCommonERC20Query,
} = require("../utils/getGraphClient");
import { init } from "@airstack/node";

init(process.env.AIRSTACK_API_KEY);
import { fetchQuery } from "@airstack/node";

const getChatData = async (req, res) => {
  //hit narendra's ai
  //input="start a chat with xyz.lens" == Output={"xmtp_chat_lens", "lens/xyz"}

  //input="start a chat with xyz.ens" == Output={"xmtp_chat_address", "<address>"}

  //input="start a huddle with <address>" == Output={"huddle_meet_address", "<address>"}

  //

  const graphApiUrl = "https://api-v2.lens.dev/";
  const apolloClient = getApolloClient(graphApiUrl);
  const graphQuery = getAddressQuery("lens/spicegirl");
  console.log(graphQuery);

  var response = await apolloClient.query({
    query: gql(graphQuery),
  });
  // console.log(response.data.profile.ownedBy.address);
  const obj = {
    sender: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
    receiver: response.data.profile.ownedBy.address,
  };

  const commonQuery = getCommonERC20Query(obj);
  console.log(commonQuery);

  const { data, error } = await fetchQuery(query);
  console.log(data);
  const final = {
    address: response.data.profile.ownedBy.address,
    data,
  };
  res.send(final);
};

module.exports = { getChatData };
