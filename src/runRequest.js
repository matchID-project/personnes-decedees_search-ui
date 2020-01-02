export default async function runRequest(body) {

  const response = await fetch(`/personnes-decedees-search-ui/api/v0/search`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  });
  return response.json();
}
