import axios from "axios";
import fs from "fs";
import path from "path";
import config from "../config.cjs";

const installPlugin = async (m, gss) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : "";
  const args = m.body.slice(prefix.length + cmd.length).trim().split(" ");

  if (cmd !== "plugin") return; // Only ".plugin <gist-url>" will work

  if (args.length === 0 || !args[0].startsWith("https://gist.github.com/")) {
    return m.reply("❌ Please provide a valid GitHub Gist URL.");
  }

  const gistUrl = args[0];

  try {
    // Extract Gist ID
    const gistId = gistUrl.split("/").pop();

    // Fetch Gist file from API
    const gistApiUrl = `https://api.github.com/gists/${gistId}`;
    const response = await axios.get(gistApiUrl);

    if (!response.data.files || Object.keys(response.data.files).length === 0) {
      return m.reply("❌ No files found in the Gist.");
    }

    const fileName = Object.keys(response.data.files)[0];
    const fileContent = response.data.files[fileName].content;

    // Save the plugin in the plugins folder
    const pluginPath = path.join("./plugins", fileName);
    fs.writeFileSync(pluginPath, fileContent);

    m.reply(`✅ Plugin "${fileName}" installed successfully!`);

    // Auto-reload the plugin
    import(`../plugins/${fileName}?update=${Date.now()}`).then(() => {
      m.reply(`♻️ Plugin "${fileName}" reloaded successfully!`);
    }).catch((err) => {
      console.error("Plugin Load Error:", err);
      m.reply("❌ Error loading the plugin. Please check the file.");
    });

  } catch (error) {
    console.error("Plugin Install Error:", error);
    m.reply("❌ Failed to install the plugin.");
  }
};

export default installPlugin;
