const sgMail = require('@sendgrid/mail');
const { MongoClient } = require('mongodb');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { name, email, message } = JSON.parse(event.body);

  // Set up SendGrid
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  // Connect to MongoDB
  const client = new MongoClient(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    const database = client.db('your-database-name');
    const collection = database.collection('submissions');

    const newSubmission = { name, email, message, date: new Date() };
    await collection.insertOne(newSubmission);

    const msg = {
      to: 'eyoon06@gmail.com',
      from: 'your-email@example.com',
      subject: 'New Contact Form Submission',
      text: `You have a new form submission from ${name} (${email}): ${message}`,
    };

    await sgMail.send(msg);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Form submission saved and email sent!' }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to submit form' }),
    };
  } finally {
    await client.close();
  }
};
