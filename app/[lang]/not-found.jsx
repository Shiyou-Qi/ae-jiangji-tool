'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ArrowRight, FileGlyph } from '@/components/Icons';

const copy = {
  zh: {
    badge: '404 · PROJECT ROUTE LOST',
    titleA: '这个页面没有降级成功',
    titleB: '但你的工程还能救回来',
    lede:
      '这个链接已经不存在，或者版本路径写错了。直接回到工具页，选择 PR 或 AE，把工程重新带回旧版本。',
    home: '返回首页',
    pr: 'PR 降级',
    ae: 'AE 降级',
    panelTitle: 'route_recovery.scan',
    source: 'unknown_page.aeback',
    sourceMeta: 'Missing route · 404',
    output: 'downgrade_tool.ready',
    outputMeta: 'Choose a converter · no file uploaded',
    target: 'Recovery target',
    status: 'Redirect options ready',
    cards: [
      ['PR', '.prproj', 'Premiere Pro 工程降级'],
      ['AE', '.aep', 'After Effects 工程降级'],
      ['SEO', '308', '旧链接可被接回'],
    ],
  },
  en: {
    badge: '404 · PROJECT ROUTE LOST',
    titleA: 'This page did not downgrade cleanly',
    titleB: 'but your project can still be recovered',
    lede:
      'The link is gone, or the version path is off. Jump back into the right converter and bring the project down to an older version.',
    home: 'Back home',
    pr: 'Premiere downgrader',
    ae: 'After Effects downgrader',
    panelTitle: 'route_recovery.scan',
    source: 'unknown_page.aeback',
    sourceMeta: 'Missing route · 404',
    output: 'downgrade_tool.ready',
    outputMeta: 'Choose a converter · no file uploaded',
    target: 'Recovery target',
    status: 'Redirect options ready',
    cards: [
      ['PR', '.prproj', 'Premiere Pro downgrader'],
      ['AE', '.aep', 'After Effects downgrader'],
      ['SEO', '308', 'Legacy links can recover'],
    ],
  },
};

export default function NotFound() {
  const pathname = usePathname() || '';
  const lang = pathname.startsWith('/en') ? 'en' : 'zh';
  const t = copy[lang];
  const base = `/${lang}`;

  return (
    <section className="notfound">
      <div className="wrap notfound__in">
        <div className="notfound__copy">
          <p className="kicker">{t.badge}</p>
          <div className="notfound__code" aria-hidden="true">
            <span>4</span>
            <span>0</span>
            <span>4</span>
          </div>
          <h1 className="h1">
            {t.titleA}
            <br />
            <span className="accent-text">{t.titleB}</span>
          </h1>
          <p className="lede">{t.lede}</p>

          <div className="notfound__actions" aria-label="404 actions">
            <Link className="btn btn--primary btn--lg" href={`${base}/premiere-pro-downgrader`}>
              {t.pr}
              <ArrowRight />
            </Link>
            <Link className="btn btn--lg" href={`${base}/after-effects-downgrader`}>
              {t.ae}
              <ArrowRight />
            </Link>
            <Link className="btn btn--quiet btn--lg" href={base}>
              {t.home}
            </Link>
          </div>
        </div>

        <div className="notfound__visual" aria-hidden="true">
          <div className="notfound-console">
            <div className="notfound-console__bar">
              <span />
              <span />
              <span />
              <p>{t.panelTitle}</p>
            </div>

            <div className="notfound-file notfound-file--bad">
              <FileGlyph />
              <div>
                <strong>{t.source}</strong>
                <span>{t.sourceMeta}</span>
              </div>
              <b>!</b>
            </div>

            <div className="notfound-path">
              <i />
              <i />
              <i />
            </div>

            <div className="notfound-file notfound-file--ok">
              <FileGlyph />
              <div>
                <strong>{t.output}</strong>
                <span>{t.outputMeta}</span>
              </div>
              <b>✓</b>
            </div>

            <p className="notfound-console__label">{t.target}</p>
            <div className="notfound-pills">
              <span>CS6</span>
              <span>2021</span>
              <span className="is-hot">2023</span>
              <span>2024</span>
              <span>2026</span>
            </div>

            <div className="notfound-meter">
              <span />
            </div>

            <p className="notfound-console__status">{t.status}</p>

            <div className="notfound-mini">
              {t.cards.map(([label, meta, text]) => (
                <div key={label}>
                  <b>{label}</b>
                  <span>{meta}</span>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
