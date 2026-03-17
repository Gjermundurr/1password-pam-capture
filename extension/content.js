// Detect clicks on the "Copy Password" button
document.addEventListener('click', (e) => {
  const btn = e.target.closest('button[name="CopyPassword"]');
  if (!btn) return;

  const card = btn.closest('mat-card');
  if (!card) return;

  // Extract user and domain from the card text
  const lines = card.innerText.split('\n');
  const domain = lines[2]?.trim();
  const user = lines[4]?.trim();
  if (!domain || !user) return;

  const username = `${user}@${domain}`;
  console.log("Detected username:", username);

  // Send to local server (clipboard already has the password)
  fetch("http://localhost:3000/save-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username })
  })
  .then(res => res.json())
  .then(data => console.log("Server response:", data))
  .catch(err => console.error("Request failed:", err));
}, true);
