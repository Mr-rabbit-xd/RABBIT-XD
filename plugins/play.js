const play = async (m, gss) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : "";
  const args = m.body.slice(prefix.length + cmd.length).trim().split(" ");

  // Only allow "play" and "gan" commands
  const playCommands = ["play", "gan"];

  if (!playCommands.includes(cmd)) return; // Ignore if the command is not "play" or "gan"

  if (args.length === 0 || !args.join(" ")) {
    return m.reply("*Please provide a song name or keywords to search for.*");
  }

  const searchQuery = args.join(" ");
  m.reply("*🎧 Searching for the song...*");

  try {
    const searchResults = await yts(searchQuery);
    if (!searchResults.videos || searchResults.videos.length === 0) {
      return m.reply(`❌ No results found for "${searchQuery}".`);
    }

    const firstResult = searchResults.videos[0];
    const videoUrl = firstResult.url;

    const apiUrl = `https://api.davidcyriltech.my.id/download/ytmp3?url=${videoUrl}`;
    const response = await axios.get(apiUrl);

    if (!response.data.success) {
      return m.reply(`❌ Failed to fetch audio for "${searchQuery}".`);
    }

    const { title, download_url } = response.data.result;

    await gss.sendMessage(
      m.from,
      {
        audio: { url: download_url },
        mimetype: "audio/mp4",
        ptt: false,
        caption: `🎵 *Now Playing:* ${title}`
      },
      { quoted: m }
    );

    m.reply(`✅ *${title}* has been downloaded successfully!`);
  } catch (error) {
    console.error(error);
    m.reply("❌ An error occurred while processing your request.");
  }
};
