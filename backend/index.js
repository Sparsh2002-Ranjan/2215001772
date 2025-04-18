import express from 'express';
import axios from 'axios';
import { getToken } from './token.js';

const app = express();
const port = 3000;

const VALID_TYPES = {
  p: 'primes',
  f: 'fibo',
  e: 'even',
  r: 'rand'
};

let windowBuffer = [];
const MAX_WINDOW_SIZE = 10;

const fetchNumbers = async (typeKey) => {
  const type = VALID_TYPES[typeKey];
  const token = await getToken();

  const source = axios.CancelToken.source();
  const timeout = setTimeout(() => source.cancel('Timeout'), 500);

  try {
    const res = await axios.get(`http://20.244.56.144/evaluation-service/${type}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      cancelToken: source.token
    });

    clearTimeout(timeout);
    return res.data.numbers || [];
  } catch (err) {
    clearTimeout(timeout);
    console.error('Error fetching numbers:', err.message);
    return [];
  }
};

const calculateAverage = (nums) => {
  if (nums.length === 0) return 0;
  const sum = nums.reduce((a, b) => a + b, 0);
  return parseFloat((sum / nums.length).toFixed(2));
};

app.get('/numbers/:numberid', async (req, res) => {
  const { numberid } = req.params;

  if (!VALID_TYPES[numberid]) {
    return res.status(400).json({ error: 'Invalid number ID' });
  }

  const prevState = [...windowBuffer];
  const fetched = await fetchNumbers(numberid);
  const uniqueNew = fetched.filter(n => !windowBuffer.includes(n));

  for (const num of uniqueNew) {
    if (windowBuffer.length >= MAX_WINDOW_SIZE) windowBuffer.shift();
    windowBuffer.push(num);
  }

  return res.json({
    windowPrevState: prevState,
    windowCurrState: windowBuffer,
    numbers: fetched,
    average: calculateAverage(windowBuffer)
  });
});

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});
