import axios from 'axios';

const wordsApiUrl = process.env.WORDS_API_URL;
const wordsApiKey = process.env.WORDS_API_KEY;

// Fetch a random word from the WordsAPI
async function getRandomWord() {
  try {
    const response = await axios.get(`${wordsApiUrl}?random=true`, {
      headers: {
        'x-rapidapi-key': wordsApiKey,
        'x-rapidapi-host': 'wordsapiv1.p.rapidapi.com',
      },
    });
    
    return response.data.word;
  } catch (error) {
    console.error('Error fetching random word:', error.message);
    throw error;
  }
}

// Fetch the definition of a word
async function getWordDefinition(word) {
  try {
    const response = await axios.get(`${wordsApiUrl}${encodeURIComponent(word)}/definitions`, {
      headers: {
        'x-rapidapi-key': wordsApiKey,
        'x-rapidapi-host': 'wordsapiv1.p.rapidapi.com',
      },
    });
    
    return response.data.definitions[0];
  } catch (error) {
    console.error('Error fetching word definition:', error.message);
    throw error;
  }
}

// Fetch antonyms for a word using the Thesaurus endpoint
async function getAntonyms(word) {
  try {
    const response = await axios.get(`${wordsApiUrl}${encodeURIComponent(word)}/antonyms`, {
      headers: {
        'x-rapidapi-key': wordsApiKey,
        'x-rapidapi-host': 'wordsapiv1.p.rapidapi.com',
      },
    });
    
    const antonyms = response.data.antonyms;
    
    // Return antonyms if available, otherwise fetch random words
    if (antonyms && antonyms.length > 0) {
      return antonyms;
    } else {
      return [await getRandomWord(), await getRandomWord()];
    }
  } catch (error) {
    console.error('Error fetching antonyms:', error.message);
    return [await getRandomWord(), await getRandomWord()];  // Fallback to random words if antonyms are unavailable
  }
}

export default async function handler(req, res) {
  try {
    const word = await getRandomWord();
    const definition = await getWordDefinition(word);
    const decoyWords = await getAntonyms(word);  // Fetch antonyms for the wrong answers

    const options = [word, ...decoyWords].sort(() => Math.random() - 0.5);

    const gameState = {
      correctWord: word,
      options,
      tally: { correct: 0, incorrect: 0, total: 0 }
    };

    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Guess The Word - Definition</title>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:button:1" content="${options[0]}" />
          <meta property="fc:frame:button:2" content="${options[1]}" />
          <meta property="fc:frame:post_url" content="${process.env.APP_URL}/api/answer" />
          <meta property="fc:frame:state" content="${encodeURIComponent(JSON.stringify(gameState))}" />
        </head>
        <body>
          <p>Definition: ${definition.definition}</p>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Error generating word frame:', error.message);
    res.status(500).json({ error: 'Internal Server Error: ' + error.message });
  }
}
