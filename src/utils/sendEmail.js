const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient");

const createSendEmailCommand = (toEmail, subject, body) => {
  const params = {
    Destination: {
      ToAddresses: [toEmail],
    },
    Message: {
      Body: {
        Text: { Data: body },
      },
      Subject: { Data: subject },
    },
    Source: "shweta@devspaceconnect.com", // Replace with your verified email address
  };

  return new SendEmailCommand(params);
}

const run = async (subject, body) => {
  const sendEmailCommand = createSendEmailCommand("shweta@devspaceconnect.com", "New Connection Request", "You have received a new connection request. Please check your DevTinder account for more details.");
  try {
    const data = await sesClient.send(sendEmailCommand);
    console.log("Email sent successfully:", data);
  } catch (err) {
    console.error("Error sending email:", err);
  }
}

module.exports = { run };