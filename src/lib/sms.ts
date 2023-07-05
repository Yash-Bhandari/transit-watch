import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";
// Set the AWS Region.
const REGION = "us-east-2"; //e.g. "us-east-1"
// Create SNS service object.
const snsClient = new SNSClient({ region: REGION });

const hotlineNumber = process.env.DESTINATION_PHONE_NUMBER;

export const sendSMS = async (msg: string, phoneNumber: string = hotlineNumber) => {
  const params = {
    Message: msg,
    PhoneNumber: phoneNumber,
  };
  try {
    const data = await snsClient.send(new PublishCommand(params));
    console.log("Success.", data);
    return data; // For unit tests.
  } catch (err) {
    console.log("Error", err.stack);
  }
};
