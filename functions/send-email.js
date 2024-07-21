require('dotenv').config();
const sgMail = require('@sendgrid/mail');
console.log('SendGrid API Key:', process.env.SENDGRID_API_KEY); // Log the API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    // Handle preflight request
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ message: 'Preflight response' }),
    };
  }

  try {
    const { name, email, message } = JSON.parse(event.body);

    const msg = {
      to: 'eyoon06@gmail.com',
      from: 'ducksluvpie@gmail.com',
      subject: `${name}'s Website Message`,
      text: message,
      html: `<strong>${message}, from ${email}</strong>`,
    };

    await sgMail.send(msg);
    console.log('Email sent successfully'); // Log success
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ message: 'Email sent successfully' }),
    };
  } catch (error) {
    console.log('Error sending email:', error.response ? error.response.body : error); // Log error
    return {
      statusCode: error.code || 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ message: error.message }),
    };
  }
};
