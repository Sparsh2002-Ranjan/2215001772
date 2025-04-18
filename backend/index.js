import express from 'express';
import axios from 'axios';

const app = express();
const PORT = 3000;
const WINDOW_SIZE = 10;

// Your token
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ0OTYyMTA1LCJpYXQiOjE3NDQ5NjE4MDUsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImU4OTM2MGM2LWRiZWItNGMzMS04NzExLWJkNzhiMTMxZjJjMCIsInN1YiI6InNwYXJzaC5yYW5qYW5fY3MyMkBnbGEuYWMuaW4ifSwiZW1haWwiOiJzcGFyc2gucmFuamFuX2NzMjJAZ2xhLmFjLmluIiwibmFtZSI6InNwYXJzaCByYW5qYW4iLCJyb2xsTm8iOiIyMjE1MDAxNzcyIiwiYWNjZXNzQ29kZSI6IkNObmVHVCIsImNsaWVudElEIjoiZTg5MzYwYzYtZGJlYi00YzMxLTg3MTEtYmQ3OGIxMzFmMmMwIiwiY2xpZW50U2VjcmV0IjoibU1meVJkYU1DWGNHYlFyVSJ9.BewdJfgS-CVi3tNRfamSVckCLae0TAkMfOqmmvJv5uw";

const window = new Set();

const urlMap = {
  p: "primes",
  f: "fibo",
  e: "even",
  r: "rand"
};

app.get('/numbers/:numberid', async (req, res) => {
  const { numberid } = req.params;
  const type = urlMap[numberid];

  if (!type) return res.status(400).json({ error: "Invalid number type ID" });

  const apiURL = `http://20.244.56.144/evaluation-service/${type}`;
  const windowPrevState = [...window];

  let numbersFetched = [];

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 500);

    const response = await axios.get(apiURL, {
      headers: {
        Authorization: `Bearer ${TOKEN}`
      },
      signal: controller.signal
    });

    clearTimeout(timeout);
    numbersFetched = response.data.numbers || [];

    // Add new unique numbers
    for (const num of numbersFetched) {
      if (!window.has(num)) {
        if (window.size >= WINDOW_SIZE) {
          const first = window.values().next().value;
          window.delete(first);
        }
        window.add(num);
      }
    }

  } catch (err) {
    console.error("Error fetching numbers:", err.message);
  }

  const windowCurrState = [...window];
  const avg = windowCurrState.length > 0
    ? windowCurrState.reduce((a, b) => a + b, 0) / windowCurrState.length
    : 0;

  return res.json({
    windowPrevState,
    windowCurrState,
    numbers: numbersFetched,
    average: avg
  });
});

app.listen(PORT, () => {
  console.log(`Backend listening at http://localhost:${PORT}`);
});
