import '@/app/globals.css';

import Script from 'next/script';
import RevealScript from '@/components/RevealScript';
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';
import { getContent } from '@/lib/content';
import { pageMeta } from '@/lib/seo';
import { LANGS, SITE } from '@/lib/site';

/** 两种语言预渲染成静态页，URL 里带语言前缀，方便分享与收录 */
export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export const dynamicParams = false;

/**
 * 根级元数据。
 *
 * ⚠️ 这里**刻意不写 alternates.canonical**。
 * layout 的 metadata 会被这个路由段下的所有子页面继承，
 * 一旦在根上写死 canonical: '/zh'，每个子页面都会对外宣称
 * 「我是首页的副本」—— 搜索引擎会因此把子页面整批踢出索引。
 * 正确做法是每一页自己声明（见 lib/seo.js 的 pageMeta）。
 */
export async function generateMetadata({ params }) {
  const { lang } = await params;
  const home = pageMeta(lang, 'home');

  return {
    ...home,
    // 兜底：将来若有页面忘了写标题，至少还能落到站点名上，而不是裸标题
    title: { default: home.title.absolute, template: `%s · ${SITE.brand}` },
  };
}

export const viewport = {
  themeColor: '#07080b',
  colorScheme: 'dark',
};

export default async function LangLayout({ children, params }) {
  const { lang } = await params;
  const dict = getContent(lang);

  return (
    <html lang={lang === 'zh' ? 'zh-CN' : 'en'}>
      <body>
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "yihv8q6zdc");
          `}
        </Script>
        <SiteHeader lang={lang} nav={dict.nav} />
        <main>{children}</main>
        <SiteFooter lang={lang} dict={dict.footer} />
        <RevealScript />
      </body>
    </html>
  );
}
