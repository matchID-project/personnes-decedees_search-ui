import handler from "./search";

export default async function runRequest(body) {
  const response = await fetch(handler, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  });
  return response.json();
}
