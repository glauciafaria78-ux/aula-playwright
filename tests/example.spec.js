import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { expect, test } from '@playwright/test';

const loginUrl = 'https://sergiocotiazure20265-ops.github.io/produtos-cypress-site/index.html';
const cadastroUrl = 'https://sergiocotiazure20265-ops.github.io/produtos-cypress-site/cadastro.html';

async function captureEvidence(page, testInfo, filename) {
  const directory = path.join('evidence', testInfo.project.name);
  await mkdir(directory, { recursive: true });
  await page.screenshot({ path: path.join(directory, filename), fullPage: true });
}

function novoEmailDeTeste() {
  return `qa-${Date.now()}-${Math.random().toString(16).slice(2)}@example.com`;
}

test('Login: deve autenticar o usuário administrador', async ({ page }, testInfo) => {
  await page.goto(loginUrl);
  await page.locator('#emailLogin').fill('admin@bluestock.com');
  await page.locator('#senhaLogin').fill('Admin@123');
  await page.locator('#btnEntrar').click();

  await expect(page).toHaveURL(/\/produtos\.html$/);
  await expect(page.getByRole('heading', { name: 'Consulta de produtos' })).toBeVisible();
  await captureEvidence(page, testInfo, 'login-sucesso.png');
});

test('Login: deve negar acesso para usuário inválido', async ({ page }, testInfo) => {
  await page.goto(loginUrl);
  await page.locator('#emailLogin').fill('invalido@example.com');
  await page.locator('#senhaLogin').fill('SenhaErrada@123');
  await page.locator('#btnEntrar').click();

  await expect(page.locator('#alertaLogin')).toHaveText('E-mail ou senha inválidos.');
  await captureEvidence(page, testInfo, 'login-acesso-negado.png');
});

test('Cadastro: deve criar um usuário com sucesso', async ({ page }, testInfo) => {
  await page.goto(cadastroUrl);
  await page.locator('#nomeUsuario').fill('Usuário de Teste');
  await page.locator('#emailUsuario').fill(novoEmailDeTeste());
  await page.locator('#senhaUsuario').fill('Teste@123');
  await page.locator('#btnCadastrarUsuario').click();

  await expect(page.locator('#alertaCadastroUsuario'))
    .toHaveText('Usuário cadastrado com sucesso. Você já pode fazer login.');
  await captureEvidence(page, testInfo, 'cadastro-sucesso.png');
});

test('Cadastro: não deve permitir o cadastro de e-mail duplicado', async ({ page }, testInfo) => {
  const email = novoEmailDeTeste();
  await page.goto(cadastroUrl);
  await page.locator('#nomeUsuario').fill('Usuário de Teste');
  await page.locator('#emailUsuario').fill(email);
  await page.locator('#senhaUsuario').fill('Teste@123');
  await page.locator('#btnCadastrarUsuario').click();

  await expect(page.locator('#alertaCadastroUsuario'))
    .toHaveText('Usuário cadastrado com sucesso. Você já pode fazer login.');

  await page.locator('#nomeUsuario').fill('Usuário Repetido');
  await page.locator('#emailUsuario').fill(email);
  await page.locator('#senhaUsuario').fill('OutraSenha@123');
  await page.locator('#btnCadastrarUsuario').click();

  await expect(page.locator('#alertaCadastroUsuario'))
    .toHaveText('Já existe um usuário cadastrado com este e-mail.');
  await captureEvidence(page, testInfo, 'cadastro-email-duplicado.png');
});
