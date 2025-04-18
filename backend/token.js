import axios from 'axios';

const AUTH_URL = 'http://20.244.56.144/evaluation-service/auth';

const authPayload = {
  email: "sparsh.ranjan_cs22@gla.ac.in",
  name: "Sparsh Ranjan",
  mobileNo: "8955439931",
  githubUsername:"Sparsh2002-Ranjan",
  rollNo: "2215001772",
  collegeName:"GLA University",
  accessCode: "CNneGT"
};

let cachedToken = null;
let expiry = 0;

export const getToken = async () => {
  const now = Date.now() / 1000;
  if (cachedToken && now < expiry - 60) return cachedToken;

  try {
    const res = await axios.post(AUTH_URL, authPayload);
    cachedToken = res.data.access_token;
    expiry = now + res.data.expires_in;
    return cachedToken;
  } catch (err) {
    console.error('Failed to get token:', err.response?.data || err.message);
    throw new Error('Authentication failed');
  }
};
