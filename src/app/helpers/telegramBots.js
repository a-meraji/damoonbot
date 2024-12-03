import TelegramBot from 'node-telegram-bot-api';
import { PrismaClient } from '@prisma/client'; // Or your preferred database library

const token = 'YOUR_TELEGRAM_BOT_TOKEN'; // Replace with your bot token
const bot = new TelegramBot(token, { polling: true });

const prisma = new PrismaClient(); // Replace with your database client initialization

// Start listening to bot commands
bot.on('callback_query', async (callbackQuery) => {
  const { data, message } = callbackQuery;

  if (!message?.chat.id || !message?.message_id) return;

  const [action, formId] = data?.split(':') || [];
  if (!action || !formId) return;

  let statusUpdate = '';

  if (action === 'accept') {
    statusUpdate = 'accepted';
  } else if (action === 'reject') {
    statusUpdate = 'rejected';
  }

  // Update form status in database
  await prisma.form.update({
    where: { id: formId },
    data: { status: statusUpdate },
  });

  // Notify user about the action taken
  bot.sendMessage(message.chat.id, `Form ID ${formId} has been ${statusUpdate}.`);

  // Remove inline buttons from the message
  bot.editMessageReplyMarkup(undefined, { chat_id: message.chat.id, message_id: message.message_id });
});

export const sendFormNotification = async (formData, formId, chatId) => {
  const message = `New form submitted:\n${JSON.stringify(formData, null, 2)}`;

  const options = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Accept', callback_data: `accept:${formId}` },
          { text: 'Reject', callback_data: `reject:${formId}` },
        ],
      ],
    },
  };

  bot.sendMessage(chatId, message, options);
};

export default bot;
