import { NextResponse } from 'next/server';

export async function middleware(request) {
  const url = request.nextUrl.clone();

  if (url.pathname.startsWith('/style-parser/')) {
    const apiUrl = `https://style-parser.vercel.app${url.pathname.replace('/style-parser', '')}`;
    const response = await fetch(apiUrl, {
      headers: { 'cache-control': 'public, max-age=3600' }, // кэш на 1 час
    });

    // Копируем ответ и добавляем кэш-заголовки
    const res = new NextResponse(await response.text(), response);
    res.headers.set('Cache-Control', 'public, max-age=3600');
    return res;
  }

  return NextResponse.next();
}