export default async function handler(req, res) {
    try {
      if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
      }
  
      const { untrustedData } = req.body;
  
      const gameState = untrustedData.state ? JSON.parse(decodeURIComponent(untrustedData.state)) : null;
  
      const { correctWord, options, tally } = gameState;
      const userChoice = untrustedData.buttonIndex;
  
      const isCorrect = options[userChoice - 1] === correctWord;
      tally.total += 1;
      tally.correct += isCorrect ? 1 : 0;
      tally.incorrect += !isCorrect ? 1 : 0;
  
      if (!isCorrect) {
        const ogImageUrl = `${process.env.APP_URL}/api/og?text=Game Over!&subtext=You got ${tally.correct} words right in a row.`;
        
        res.setHeader('Content-Type', 'text/html');
        return res.status(200).send(`
          <!DOCTYPE html>
          <html>
            <head>
              <meta property="fc:frame:image" content="${ogImageUrl}" />
              <meta property="fc:frame:button:1" content="Play Again" />
              <meta property="fc:frame:button:1:action" content="${process.env.APP_URL}" />
              <meta property="fc:frame:button:2" content="Share" />
              <meta property="fc:frame:button:2:action" content="link" />
              <meta property="fc:frame:button:2:target" content="https://warpcast.com/~/compose?text=I got ${tally.correct} words in a row!&embeds[]=${encodeURIComponent(process.env.APP_URL)}" />
            </head>
          </html>
        `);
      } else {
        res.setHeader('Content-Type', 'text/html');
        return res.status(200).send(`
          <p>Correct! Next word coming...</p>
        `);
      }
    } catch (error) {
      console.error('Error processing answer:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  