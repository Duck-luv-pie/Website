const sgMail = require('@sendgrid/mail');
const { MongoClient } = require('mongodb');

exports.handler = async (event, context) => {
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

    // Log environment variables to verify they are set
    console.log('SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY ? 'Set' : 'Not Set');
    console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Not Set');

    let body;
    try {
        body = JSON.parse(event.body);
    } catch (error) {
        console.error('JSON parsing error:', error);
        return {
            statusCode: 400,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ error: 'Invalid JSON' }),
        };
    }

    const { name, email, message } = body;

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const client = new MongoClient(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    try {
        console.log('Connecting to MongoDB...');
        await client.connect();
        console.log('Connected to MongoDB');
        
        const database = client.db('website-data'); // Replace with your actual database name
        const collection = database.collection('submissions');
        
        const newSubmission = { name, email, message, date: new Date() };
        await collection.insertOne(newSubmission);
        console.log('Inserted into MongoDB');
        
        const msg = {
            to: 'eyoon06@gmail.com',
            from: 'eyoon06@gmail.com',
            subject: 'New Contact Form Submission',
            text: `You have a new form submission from ${name} (${email}): ${message}`,
        };

        await sgMail.send(msg);
        console.log('Email sent via SendGrid');

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
            body: JSON.stringify({ error: 'Failed to submit form', details: error.message }),
        };
    } finally {
        await client.close();
    }
};
