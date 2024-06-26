//thanks to inrl:https://github.com/inrl-official
import fetch from 'node-fetch';

let handler = async (m, { text, usedPrefix, command }) => {
  if (command === 'tempmail') {
    try {
      const response = await fetch('https://privatix-temp-mail-v1.p.rapidapi.com/request/delete/id/%7Bmail_id%7D/');
      const data = await response.json();

      if (data.status && data.result && data.result.length > 0) {
        const tempMails = data.result.join('\n');
        const replyMessage = `*Temporary Email Addresses from KING B2K:*\n\n${tempMails}\n\n use \`\`\`\.checkmail <mail-address>\`\`\`\ if you want to check inbox of any temp mail used from above`;
        m.reply(replyMessage);
      } else {
        m.reply('Nahi Mili Bhai...');
      }
    } catch (error) {
      console.error('Error:', error);
      m.reply('Nahi mili bhai temporary Email..Bhot dhunda..');
    }
  } else if (command === 'checkmail') {
    if (!text && !(m.quoted && m.quoted.text)) {
      m.reply('Mail address to bata chutiye...');
      return;
    }

    if (!text && m.quoted && m.quoted.text) {
      text = m.quoted.text;
    } else if (text && m.quoted && m.quoted.text) {
      text = `${text} ${m.quoted.text}`;
    }

    try {
      const response = await fetch(`https://privatix-temp-mail-v1.p.rapidapi.com/request/delete/id/%7Bmail_id%7D/=${encodeURIComponent(text)}&apikey=inrl`);
      const data = await response.json();

      if (data.status && data.result && data.result.length > 0) {
        const messages = data.result.map((message) => {
          return `
*From:* ${message.from}
*Subject:* ${message.subject}
*Date:* ${message.date}
*Body:*
${message.text}
          `;
        }).join('\n\n---\n\n');
        const replyMessage = `*Messages in* ${text}:\n\n${messages}`;
        m.reply(replyMessage);
      } else {
        m.reply(`No messages found in ${text}.`);
      }
    } catch (error) {
      console.error('Error:', error);
      m.reply(`Failed to check messages in ${text}.`);
    }
  }
};
handler.help = ['tempmail']
handler.tags = ['tools']
handler.command = ['tempmail', 'checkmail'];
handler.diamond = false;

export default handler;
