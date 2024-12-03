import { NextResponse } from 'next/server';
import { sendFormNotification } from '@/helpers/telegramBot'; // Adjust the import path

export async function POST(request) {
  const formData = await request.json();

  // Save form data to database
  const formId = 'UNIQUE_FORM_ID'; // Generate a unique ID for the form, e.g., from your database
  const chatId = 123456789; // Replace with the specific user's Telegram chat ID

  try {
    // Simulate saving data to the database
    // Replace with your database logic
    // const savedForm = await prisma.form.create({ data: formData });
    // const formId = savedForm.id;

    // Notify user via Telegram bot
    await sendFormNotification(formData, formId, chatId);

    return NextResponse.json({ message: 'Form submitted successfully!' });
  } catch (error) {
    console.error('Error submitting form:', error);
    return NextResponse.json({ error: 'Error submitting form.' }, { status: 500 });
  }
}
