import { expect, test } from '@playwright/test';
import { SignJWT } from 'jose';

const ownerId = 'b7151d51-41da-4a2e-8529-f455edb657a0';

for (const role of ['admin', 'staff']) {
  test(`${role} can edit the minimal pipeline without sending messages`, async ({ page, context, baseURL }, testInfo) => {
    test.skip(!baseURL?.startsWith('http://127.0.0.1:'), 'Local test server only.');
    const token = await new SignJWT({ role, permissions: ['inquiries'], userId: ownerId })
      .setProtectedHeader({ alg: 'HS256' }).setExpirationTime('10m')
      .sign(new TextEncoder().encode('local-inquiry-regression-test-secret-only-2026'));
    await context.addCookies([{ name: 'admin_token', value: token, url: baseURL! }]);
    await page.route('**/api/auth/me', (route) => route.fulfill({ json: { user: { id: ownerId, name: 'Sales test', role, permissions: ['inquiries'] } } }));
    let row = {
      id: 'c7151d51-41da-4a2e-8529-f455edb657a0', name: 'School buyer', email: 'buyer@example.com',
      company: 'School procurement', subject: 'Classroom project', phone: '+44 12345678',
      message: 'Need 20 classroom projectors', inquiry_type: 'wholesale', status: 'pending',
      reply: 'Old note', channel: 'website', assigned_to: role === 'admin' ? null : ownerId,
      next_follow_up_at: null, workflow_version: 0, created_at: '2026-10-12T01:00:00Z',
    };
    let saved: Record<string, unknown> | undefined;
    let conflict = false;
    let sentMessages = 0;
    await page.route('**/api/**', async (route) => {
      if (/email|send-message/.test(route.request().url())) { sentMessages++; await route.abort(); }
      else await route.fallback();
    });
    await page.route('**/api/admin/inquiries**', async (route) => {
      const req = route.request();
      if (new URL(req.url()).pathname.endsWith('/owners')) {
        await route.fulfill({ json: { data: [{ id: ownerId, name: 'Sales test' }] } }); return;
      }
      if (req.method() === 'PUT') {
        saved = req.postDataJSON();
        if (conflict) { await route.fulfill({ status: 409, json: { error: '记录已更新，请刷新' } }); return; }
        row = { ...row, ...saved, workflow_version: row.workflow_version + 1 };
        await route.fulfill({ json: { data: row, success: true } }); return;
      }
      const search = new URL(req.url()).searchParams.get('search');
      await route.fulfill({ json: { data: [search ? { ...row, subject: 'Older matching inquiry' } : row], viewer: { id: ownerId, name: 'Sales test', is_manager: role === 'admin' }, pagination: { page: 1, limit: 10, total: 1, totalPages: 1 } } });
    });
    await page.goto('/admin/inquiries');
    await page.getByText('Classroom project', { exact: true }).filter({ visible: true }).click();
    await expect(page.getByText('Need 20 classroom projectors', { exact: true }).filter({ visible: true })).toBeVisible();
    const visible = (name: string) => page.getByLabel(name, { exact: true }).filter({ visible: true });
    if (role === 'admin') await visible('负责人').selectOption(ownerId);
    else await expect(visible('负责人')).toHaveCount(0);
    await visible('状态').selectOption('negotiating');
    await visible('下次跟进').fill('2026-10-13T00:30');
    await visible('来源').selectOption('whatsapp');
    await visible('内部备注').fill('');
    await page.getByRole('button', { name: '保存跟进' }).filter({ visible: true }).click();
    await expect(page.getByText('跟进已保存', { exact: true })).toBeVisible();
    expect(saved?.next_follow_up_at).toBe('2026-10-12T16:30:00.000Z');
    expect(saved?.reply).toBe('');
    expect(saved?.expected_version).toBe(0);
    expect(saved?.assigned_to).toBe(role === 'admin' ? ownerId : undefined);
    await expect(visible('下次跟进')).toHaveValue('2026-10-13T00:30');
    conflict = true;
    await visible('内部备注').fill('Keep unsaved note');
    await page.getByRole('button', { name: '保存跟进' }).filter({ visible: true }).click();
    await expect(page.getByRole('alert').filter({ hasText: '记录已更新', visible: true })).toBeVisible();
    await expect(visible('内部备注')).toHaveValue('Keep unsaved note');
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: testInfo.outputPath('pipeline.png'), fullPage: true });
    await visible('搜索可见询盘').fill('Older');
    await expect(page.getByText('Older matching inquiry', { exact: true }).filter({ visible: true })).toBeVisible();
    expect(sentMessages).toBe(0);
  });
}
