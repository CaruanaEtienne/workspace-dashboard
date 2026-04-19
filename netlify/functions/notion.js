exports.handler = async (event) => {
  const token = process.env.NOTION_TOKEN;
  const CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
  };
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };
  const path = event.queryStringParameters?.path || '';
  const url = 'https://api.notion.com/v1/' + path;
  try {
    const res = await fetch(url, {
      method: event.httpMethod,
      headers: {
        'Authorization': 'Bearer ' + token,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      ...(event.body ? { body: event.body } : {}),
    });
    const data = await res.text();
    return { statusCode: res.status, headers: { ...CORS, 'Content-Type': 'application/json' }, body: data };
  } catch (e) {
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: e.message }) };
  }
};
