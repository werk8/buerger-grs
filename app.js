import "./instrument.js";
import * as Sentry from "@sentry/node"
import express from 'express';
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 8080;

app.use((req, res, next) => {
  const authHeader = req.headers['authorization']; 
  const token = authHeader?.split(' ')[1];
  if (token !== process.env.TOKEN) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
});

app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip
    }));
  });

  next();
});

app.get('/products/:id', async (req, res) => {
  const productId = req.params.id
  const url = `${process.env.URL}/view/ProductInformation?artnr=%27${productId}%27`

  console.log(JSON.stringify({
    event: "fetch_product",
    productId,
    url: url
  }));
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json()

    res.json(data);
  } catch (error) {
     console.error(JSON.stringify({
      event: "error_fetch_product",
      productId,
      error: error.message
    }));

    res.status(500).json({ error: 'Error on fetching data' });
  }
});

Sentry.setupExpressErrorHandler(app);

app.use(function onError(err, req, res, next) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});

app.listen(PORT, () => {
  console.log(`Proxy-Server runs on Port ${PORT}`);
});
