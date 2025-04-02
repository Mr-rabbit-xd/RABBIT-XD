import config from '../config.cjs';

const alive = async (m, Matrix) => {
  const uptimeSeconds = process.uptime();
  const days = Math.floor(uptimeSeconds / (3600 * 24));
  const hours = Math.floor((uptimeSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  const seconds = Math.floor(uptimeSeconds % 60);
  const timeString = `${days}d ${hours}h ${minutes}m ${seconds}s`;

  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

  if (!['alive', 'uptime', 'runtime'].includes(cmd)) return;

  const str = `*🐰 Rabbit XD is Alive!*
*⏳ Uptime: ${timeString}*`;

  await Matrix.sendMessage(m.from, {
    image: { url: "https://files.catbox.moe/clj910.jpeg" }, 
    caption: str,
    contextInfo: {
      mentionedJid: [m.sender],
      forwardingScore: 999,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363406899332269@newsletter',
        newsletterName: "ＭＲ－ Ｒａｂｂｉｔ",
        serverMessageId: 143
      }
    }
  }, {
    quoted: m
  });
};

export default alive;
