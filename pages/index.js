import Head from 'next/head';

export default function Home() {
  console.log('Rendering GuessTheWord home page...');
  
  const shareText = encodeURIComponent('Can you guess the correct word based on the definition?\n\nPlay now!\n\n');
  const shareLink = `https://warpcast.com/~/compose?text=${shareText}&embeds[]=${encodeURIComponent(process.env.APP_URL)}`;

  return (
    <div>
      <Head>
        <title>Guess The Word</title>
        <meta property="og:title" content="Guess The Word Game" />
        <meta property="og:image" content={`${process.env.APP_URL}/wordGuess.png`} />
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content={`${process.env.APP_URL}/wordGuess.png`} />
        <meta property="fc:frame:button:1" content="Start Game" />
        <meta property="fc:frame:post_url" content={`${process.env.APP_URL}/api/wordFrame`} />
        <meta property="fc:frame:button:2" content="Share" />
        <meta property="fc:frame:button:2:target" content={shareLink} />
      </Head>
      <main>
        <h1>Welcome to Guess The Word!</h1>
        <p>Can you guess the word based on its definition?</p>
      </main>
    </div>
  );
}
