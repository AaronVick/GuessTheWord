import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default function handler(req) {
  const { searchParams } = new URL(req.url);
  const text = searchParams.get('text');
  const subtext = searchParams.get('subtext');

  return new ImageResponse(
    (
      <div
        style={{
          backgroundColor: 'lightblue',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          width: '100%',
          flexDirection: 'column',
        }}
      >
        <h1 style={{ fontSize: 60, marginBottom: 20 }}>{text}</h1>
        {subtext && <p style={{ fontSize: 30 }}>{subtext}</p>}
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
