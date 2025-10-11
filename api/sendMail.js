import nodemailer from 'nodemailer';
export async function POST(request) {
  try {
    const {
      name,
      phone,
      message,
      pages_count,
      design_selected,
      adaptive_selected,
      crm_selected,
      dop_selected,
      seo_selected,
      platform_type,
      total_cost
    } = await request.json();
    if (!phone || phone.trim().length !== 10 || !/^\d{10}$/.test(phone)) {
  return new Response(
    JSON.stringify({ error: 'Введите телефон полностью в формате +7 (XXX) XXX-XX-XX.' }),
    { status: 400 }
  );
}
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASS,
      },
    });
    const calcFields = [
      pages_count ? `Количество страниц: ${pages_count}` : null,
      design_selected ? `Дизайн: ${design_selected}` : null,
      adaptive_selected ? `Адаптивность: ${adaptive_selected}` : null,
      crm_selected ? `CRM: ${crm_selected}` : null,
      dop_selected ? `Кастомизация: ${dop_selected}` : null,
      seo_selected ? `SEO: ${seo_selected}` : null,
      platform_type ? `Платформа: ${platform_type}` : null,
      total_cost ? `Итоговая стоимость: ${total_cost}` : null,
    ].filter(Boolean);
    const mailText =
      `Имя: ${name || 'Не указано'}\n` +
      `Телефон: +7${phone}\n` +
      `Задача:\n${message || 'Не указано'}\n\n` +
      (calcFields.length
        ? `---\nДанные калькулятора:\n${calcFields.join('\n')}\n`
        : '');
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER,
      subject: `Новая заявка${name ? ` от ${name}` : ''}`,
      text: mailText,
    });
    return new Response(JSON.stringify({ message: 'Письмо отправлено' }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Ошибка при отправке' }), { status: 500 });
  }
}