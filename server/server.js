const sgMail = require('@sendgrid/mail');
const { MongoClient } = require('mongodb');

exports.handler = async (event, context) => {
  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST',
      },
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  const { name, email, message } = JSON.parse(event.body);

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const client = new MongoClient(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    const database = client.db('website-data');  // Use your actual database name here
    const collection = database.collection('submissions');

    const newSubmission = { name, email, message, date: new Date() };
    await collection.insertOne(newSubmission);

    const msg = {
      to: 'eyoon06@gmail.com',
      from: 'eyoon06@gmail.com',  // Sender email verified with SendGrid
      subject: 'New Contact Form Submission',
      text: `You have a new form submission from ${name} (${email}): ${message}`,
    };

    await sgMail.send(msg);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ message: 'Form submission saved and email sent!' }),
    };
  } catch (error) {
    console.error('Error processing request:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Failed to submit form' }),
    };
  } finally {
    await client.close();
  }
};
