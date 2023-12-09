const { gql } = require("@apollo/client");
const {
  getApolloClient,
  getAddressQuery,
  getCommonERC20Query,
} = require("../utils/getGraphClient");
const { init } = require("@airstack/node");
const { config } = require("dotenv");

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
