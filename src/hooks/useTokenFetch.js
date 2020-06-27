import { useEffect, useState } from 'react';

export default function useTokenFetch() {
  const [token, setToken] = useState();

  useEffect(() => {
    const clientID = process.env.REACT_APP_API_KEY;
    const credentials = Buffer.from(`${clientID}:`).toString('base64');
    const searchParams = new URLSearchParams([
      ['grant_type', 'https://oauth.reddit.com/grants/installed_client'],
      ['device_id', 'DO_NOT_TRACK_THIS_DEVICE'],
    ]);
    fetch(`https://www.reddit.com/api/v1/access_token?${searchParams}`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => response.json())
      .then((response) => setToken(response.access_token));
  }, []);
  return { token };
}
