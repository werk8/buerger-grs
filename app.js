import express from 'express';
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 8080;

 const productData = [
  {
    "id": "Produktbeschreibung",
    "label": "Produktbeschreibung",
    "content": [
      {
        "type": "paragraph",
        "text": "Lorem ipsum sit dolor aby artisan small batch shaman schlitz offal normcore. Mumblecore food truck next level fingerstache sriracha cred cronut meditation ennui art party 8-bit helvetica edison bulb try-hard. Narwhal helvetica squid...",
        "spans": [],
        "direction": "ltr"
      }
    ]
  },
  {
    "id": "Zutaten",
    "label": "Zutaten",
    "content": [
      {
        "type": "paragraph",
        "text": "28% Schweinefleisch, HARTWEIZENGRIEß, Wasser, Weißbrot (WEIZENMEHL, Wasser, Speisesalz, Hefe), Spinat, Zwiebeln, VOLLEI**, Speisesalz, Petersilie, Dextrose, Stabilisator: Natriumcitrate, Gewürze, Gewürzextrakte (enthält SELLERIE), Rapsöl.** Eier aus Bodenhaltung.",
        "spans": [],
        "direction": "ltr"
      }
    ]
  },
  {
    "id": "Allergikerhinweise",
    "label": "Allergikerhinweise",
    "content": [
      {
        "type": "paragraph",
        "text": "Es sind Ei, Milch und Weizen enthalten. Kann Spuren von Soja und Sellerie enthalten.",
        "spans": [],
        "direction": "ltr"
      }
    ]
  },
  {
    "id": "Zubereitungsempfehlung",
    "label": "Zubereitungsempfehlung",
    "content": [
      {
        "type": "paragraph",
        "text": "Pfanne: Butter oder Öl erhitzen, Maultaschen wahlweise am Stück oder geschnitten hinzugeben und bei mittlerer Hitze goldgelb anbraten.",
        "spans": [],
        "direction": "ltr"
      }
    ]
  },
  {
    "id": "Lagerhinweise",
    "label": "Lagerhinweise",
    "content": [
      {
        "type": "paragraph",
        "text": "Kühlart: gekühlt, Lagertemparatur: < 7 °C",
        "spans": [],
        "direction": "ltr"
      }
    ]
  }
]


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
  const url = `${process.env.URL}/view/Productinformation?artnr=${productId}`

  console.log(JSON.stringify({
    event: "fetch_product",
    productId,
    url: `${process.env.URL}/view/Productinformation?artnr=${productId}`
  }));
  
  try {
    // const response = await fetch(url);
    
    // if (!response.ok) {
    //   throw new Error(`HTTP ${response.status}`);
    // }

    res.json(productData);
  } catch (error) {
     console.error(JSON.stringify({
      event: "error_fetch_product",
      productId,
      error: error.message
    }));

    res.status(500).json({ error: 'Error on fetching data' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy-Server runs on Port ${PORT}`);
});
