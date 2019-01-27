import $ from "jquery";

require("dotenv").config();

const processing = () => {
  var subscriptionKey = process.env.API_KEY;
  console.log(subscriptionKey);
  // $.ajax();
};

export default processing;
