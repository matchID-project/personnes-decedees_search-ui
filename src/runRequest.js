export default async function runRequest(body) {
  const path = process.env.ES_PATH;
  const index = process.env.ES_INDEX;

  const response = await fetch(`${path}/${index}/_search`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  });
  return response.json();
}
