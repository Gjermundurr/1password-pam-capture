const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");

const app = express();
app.use(express.json());
app.use(cors({ origin: "https://pam.ikommservices.no" }));

app.post("/save-password", (req, res) => {
  const { username } = req.body;
  if (!username) {
    console.warn("⚠️ Received request with missing username");
    return res.status(400).json({ status: "error", message: "Missing username" });
  }

  const itemName = `PAM ${username}`.replace(/"/g, '\\"');
  console.log(`🔹 Processing credential: ${itemName}`);

  // Try to edit existing item
  const editCmd = `PASSWORD=$(wl-paste) && op item edit "${itemName}" --vault "Employee" password="$PASSWORD"`;

  exec(editCmd, (err, stdout, stderr) => {
    if (!err) {
      console.log(`✅ Updated existing item: ${itemName}`);
      return res.json({ status: "updated", message: `Updated ${itemName}` });
    }

    if (stderr.includes("isn't an item in the")) {
      console.log(`ℹ️ Item not found, creating new: ${itemName}`);
      const createCmd = `PASSWORD=$(wl-paste) && op item create --category login --title "${itemName}" --vault "Employee" username="${username}" password="$PASSWORD"`;
      exec(createCmd, (cErr, cOut, cStderr) => {
        if (cErr) {
          console.error(`❌ Failed to create item: ${itemName}`, cStderr);
          return res.status(500).json({ status: "error", message: "Failed to create credential" });
        }
        console.log(`✅ Created new item: ${itemName}`);
        return res.json({ status: "created", message: `Created ${itemName}` });
      });
    } else {
      console.error(`❌ Failed to update item: ${itemName}`, stderr);
      return res.status(500).json({ status: "error", message: "Failed to update credential" });
    }
  });
});

app.listen(3000, () => console.log("🟢 Server running on http://localhost:3000"));
