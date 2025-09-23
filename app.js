import express from 'express';
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 8080;

const productData = {
  Produktbeschreibung: [
    {
      type: "paragraph",
      text: "Lorem ipsum sit dolor aby artisan small batch shaman schlitz offal normcore. Mumblecore food truck next level fingerstache sriracha cred cronut meditation ennui art party 8-bit helvetica edison bulb try-hard. Narwhal helvetica squid...",
      spans: [],
      direction: "ltr",
    },
  ],
  Zutaten: [
    {
      type: "paragraph",
      text: "28% Schweinefleisch, HARTWEIZENGRIEß, Wasser, Weißbrot (WEIZENMEHL, Wasser, Speisesalz, Hefe), Spinat, Zwiebeln, VOLLEI**, Speisesalz, Petersilie, Dextrose, Stabilisator: Natriumcitrate, Gewürze, Gewürzextrakte (enthält SELLERIE), Rapsöl.** Eier aus Bodenhaltung.",
      spans: [],
      direction: "ltr",
    },
  ],
  Allergikerhinweise: [
    {
      type: "paragraph",
      text: "Es sind Ei, Milch und Weizen enthalten. Kann Spuren von Soja und Sellerie enthalten.",
      spans: [],
      direction: "ltr",
    },
  ],
  Zubereitungsempfehlung: [
    {
      type: "paragraph",
      text: "Pfanne: Butter oder Öl erhitzen, Maultaschen wahlweise am Stück oder geschnitten hinzugeben und bei mittlerer Hitze goldgelb anbraten.",
      spans: [],
      direction: "ltr",
    },
  ],
  Lagerhinweise: [
    {
      type: "paragraph",
      text: "Kühlart: gekühlt, Lagertemparatur: < 7 °C",
      spans: [],
      direction: "ltr",
    },
  ],
};

app.use((req, res, next) => {
  const authHeader = req.headers['authorization']; 
  const token = authHeader?.split(' ')[1];
  if (token !== process.env.TOKEN) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
});


app.get('/grs', async (req, res) => {
  try {
    res.json(productData);
  } catch (error) {
    res.status(500).json({ error: 'Error on fetching data' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy-Server runs on Port ${PORT}`);
});
