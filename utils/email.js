const sgMail = require("@sendgrid/mail");

const sendEmailToUser = (user, forgetCode) => {
  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const token = Math.floor(100000 + Math.random() * 900000);

    const msg = {
      to: user.email, // Change to your recipient
      from: "itsmeumer96@gmail.com", // Change to your verified sender
      subject: `Hi ${user.firstName} Please Reset Your Password`,
      text: "Here is your reset code , Enter this fo verify",
      html: `<strong>${forgetCode}</strong>`,
    };

    sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent");
      })
      .catch((error) => {
        console.error(error);
      });
  } catch (err) {
    console.log(err);
  }
};

module.exports = sendEmailToUser;
