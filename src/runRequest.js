export default async function runRequest(body) {
  const path = process.env.ES_PROXY_PATH;

  const response = await fetch(`/search-ui/api/v0/search`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  });
  return response.json();
}
