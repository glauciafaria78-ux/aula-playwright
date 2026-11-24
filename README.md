# aula-playwright
Aula para demonstração de CI/CD e PIPELINE com Playwright

## Testes automatizados

Os testes cobrem login válido e inválido, criação de usuário e rejeição de e-mail
duplicado no site BlueStock.

```bash
npm test
```

As capturas de tela dos cenários são salvas em `evidence/<navegador>/` e também
publicadas como artefato pela pipeline do GitHub Actions.
