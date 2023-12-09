const { gql } = require("@apollo/client");
const {
  getApolloClient,
  getAddressQuery,
  getCommonERC20Query,
} = require("../utils/getGraphClient");
const { init } = require("@airstack/node");
const { config } = require("dotenv");

config();

init(process.env.AIRSTACK_API_KEY);
const { fetchQuery } = require("@airstack/node");

const getChatData = async (req, res) => {
  // Data is 'req': -currentUser: address of current user
  // -              - receiver: address of receiver

  //hit narendra's ai
  //input="start a chat with xyz.lens" == Output={"xmtp_chat_lens", "lens/xyz"}

  //input="start a chat with xyz.ens" == Output={"xmtp_chat_address", "<address>"}

  //input="start a huddle with <address>" == Output={"huddle_meet_address", "<address>"}

  //
  const graphApiUrl = "https://api-v2.lens.dev/";
  const apolloClient = getApolloClient(graphApiUrl);
  // console.log(req.data);
  if (req.body.data.lens) {
    const graphQuery = getAddressQuery(req.body.data.receiver);
    // console.log(graphQuery);

    var response = await apolloClient.query({
      query: gql(graphQuery),
    });
    var address = response.data.profile.ownedBy.address;
  } else {
    var address = req.body.data.receiver;
  }

  const obj = {
    sender: req.body.data.currentUser,
    receiver: address,
  };
  const commonQuery = getCommonERC20Query(obj);
  console.log(commonQuery);

  const { data, error } = await fetchQuery(commonQuery);
  if (error) {
    throw new Error(error.message);
  }
  console.log(data);
  const final = {
    address,
    data,
  };
  res.send(final);
};

module.exports = { getChatData };
