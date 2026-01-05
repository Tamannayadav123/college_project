import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

async function listModelsRest() {
  const url = 'https://generativelanguage.googleapis.com/v1beta/models';
  const res = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${process.env.GOOGLE_OAUTH_TOKEN}`
    }
  });
  const data = await res.json();
  console.log(data);
}

listModelsRest();
