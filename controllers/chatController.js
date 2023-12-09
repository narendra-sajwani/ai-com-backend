const { gql } = require("@apollo/client");
const {
  getApolloClient,
  getAddressQuery,
  getCommonERC20Query,
  getCommonNFTQuery,
} = require("../utils/getGraphClient");
const { init } = require("@airstack/node");
const { config } = require("dotenv");
const { OpenAI } = require("openai");
const fs = require("fs");
config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API,
});

init(process.env.AIRSTACK_API_KEY);
const { fetchQuery } = require("@airstack/node");

const getChatData = async (req, res) => {
  const userMessage = req.body.message;

  if (typeof userMessage !== "string" || userMessage.trim() === "") {
    return res.status(400).json({ error: "Invalid user message" });
  }

  const chats = [
    {
      role: "system",
      content:
        "Welcome to the Graph demo. You can ask me questions about the Lens, ENS Handles, and POaP NFTs",
    },
    { role: "user", content: userMessage },
  ];

  const trainedModelID = fs.readFileSync("trainedModelID.txt").toString();

  try {
    const aiResponse = await openai.chat.completions.create({
      model: trainedModelID,
      messages: chats,
    });

    const aiResponseContent = aiResponse.choices[0].message.content;
    const [action, receiver] = aiResponseContent.split(" ");
    console.log(action, receiver);

    let isLens = receiver.includes("lens/");
    console.log(isLens);

    const graphApiUrl = "https://api-v2.lens.dev/";
    const apolloClient = getApolloClient(graphApiUrl);
    // console.log(req.data);
    if (isLens) {
      const graphQuery = getAddressQuery(receiver);
      // console.log(graphQuery);

      var response = await apolloClient.query({
        query: gql(graphQuery),
      });
      var address = response.data.profile.ownedBy.address;
    } else {
      var address = receiver;
    }

    const obj = {
      sender: req.body.currentUser,
      receiver: address,
    };
    const commonTokenQuery = getCommonERC20Query(obj);
    const commonNFTQuery = getCommonNFTQuery(obj);
    console.log(commonNFTQuery);

    const tokenResult = await fetchQuery(commonTokenQuery);
    if (tokenResult.error) {
      throw new Error(error.message);
    }
    const nftResult = await fetchQuery(commonNFTQuery);
    if (nftResult.error) {
      throw new Error(nftResult.error);
    }
    // console.log(nftData);

    const final = {
      address,
      tokens: tokenResult.data,
      nfts: nftResult.data,
      action,
    };
    res.send(final);
  } catch (e) {
    console.log("error", e);
  }
};

module.exports = { getChatData };
