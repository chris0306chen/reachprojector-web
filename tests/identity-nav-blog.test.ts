import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { getCheckoutCopy } from '../src/lib/checkout-copy';
import { getPrivacyPolicy, getTermsPolicy } from '../src/lib/policy-copy';
import { buyingGuides } from '../src/lib/guides';

const source = (path: string) => readFileSync(path, 'utf8');
const company = 'Quanzhou Reach Technology Co., Ltd.';
const stripeDisclosure = 'Card payments are processed by HK REACH SOURCING LIMITED through Stripe.';

test('main navigation omits Shop by Scene while retaining the wholesale route', () => {
  const header = source('src/components/layout/header.tsx');
  assert.doesNotMatch(header, /sceneNavigation|shopByScene/);
  assert.match(header, /wholesale|oemOdmProjectors/i);
});

test('homepage features four guides after the wholesale section and keeps the full archive', () => {
  const homepage = source('src/app/[locale]/page.tsx');
  const archive = source('src/app/[locale]/guides/page.tsx');
  assert.equal(buyingGuides.length > 4, true);
  assert.match(homepage, /buyingGuides\.slice\(0, 4\)\.map/);
  assert.match(homepage, /href=\{`\/\$\{locale\}\/guides`\}/);
  assert.match(archive, /buyingGuides\.map/);
  assert.ok(homepage.indexOf("t('b2b.title')") < homepage.indexOf('buyingGuides.slice(0, 4)'));
  assert.deepEqual(buyingGuides.slice(0, 4).map(({ slug }) => slug), [
    'projector-brightness-specifications',
    'projector-sample-acceptance-checklist',
    'how-to-choose-a-projector-for-your-room',
    'ultra-short-throw-vs-standard-throw-projector',
  ]);
});

test('English and Chinese public identity and card-processing copy are consistent', () => {
  const en = JSON.parse(source('messages/en.json'));
  const zh = JSON.parse(source('messages/zh.json'));
  assert.equal(en.footer.company1, company);
  assert.equal(en.Footer.addressFujian, 'No. 1108 Quan\'an North Road, Jinjiang City, Quanzhou City, Fujian Province, China');
  assert.equal(en.footer.company2, company);
  assert.equal(en.Footer.addressHongKong, en.Footer.addressFujian);
  assert.equal(zh.footer.company1, '泉州锐驰科技有限公司');
  assert.equal(zh.footer.company2, zh.footer.company1);
  assert.equal(zh.Footer.addressHongKong, zh.Footer.addressFujian);
  assert.equal(getCheckoutCopy('en').stripeSeller, stripeDisclosure);
  assert.equal(getCheckoutCopy('zh').stripeSeller, '银行卡付款由 HK REACH SOURCING LIMITED 通过 Stripe 处理。');
  assert.ok(getTermsPolicy('en').sections.flatMap(({ items = [] }) => items).some((item) => item.includes(stripeDisclosure)));
  assert.ok(getTermsPolicy('zh').sections.flatMap(({ items = [] }) => items).some((item) => item.includes(getCheckoutCopy('zh').stripeSeller)));
  assert.ok(getPrivacyPolicy('en').summary.includes(company));
  assert.ok(getPrivacyPolicy('zh').summary.includes('泉州锐驰科技有限公司'));
});

test('footer and order email avoid presenting the Stripe processor as the seller', () => {
  const footer = source('src/components/layout/footer.tsx');
  const email = source('src/lib/order-email.ts');
  assert.match(footer, new RegExp(company));
  assert.match(footer, /addressFujian/);
  assert.doesNotMatch(footer, /HK REACH SOURCING LIMITED|addressHongKong/);
  assert.match(email, new RegExp(stripeDisclosure.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.match(email, /Payment processing/);
  assert.match(email, /input\.paymentMethod === 'paypal' \? 'Quanzhou Reach Technology Co\., Ltd\.'/);
});
