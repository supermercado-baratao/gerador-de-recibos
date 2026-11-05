# Gerador de Recibos

Aplicação para gerar recibos simplificados de salário, férias e décimo terceiro.

![Preview](./.github/preview.gif)

## Tecnologias

- [Vite Boilerplate](https://github.com/diasjoaovitor/vite-boilerplate)
- [MUI](https://mui.com//)
- [Firebase](https://firebase.google.com/) (Authentication + Firestore)
- [React Router](https://reactrouter.com/)
- [TanStack Query](https://tanstack.com/query)
- [Zustand](https://zustand.docs.pmnd.rs/)
- [Axios](https://github.com/axios/axios)
- [Extenso](https://github.com/portujs/extenso.js#readme)
- [PDFMake](http://pdfmake.org/#/)

## Como rodar o projeto

```sh
git clone https://github.com/supermercado-baratao/gerador-de-recibos
cd gerador-de-recibos
pnpm install
cp .env.example .env # preencha com as credenciais do Firebase
pnpm dev
```

## Firebase

Cada conta (e-mail e senha) tem uma empresa, cadastrada junto com a conta, e seus próprios funcionários e recibos. O acesso ao app é liberado após a confirmação do e-mail.

```text
users/{uid}/companies/main     # empresa da conta
users/{uid}/employees/{id}     # funcionários
users/{uid}/receipts/{id}      # recibos emitidos (employeeId + cópia da empresa e do funcionário)
```

No console do Firebase:

1. Crie um app Web e copie as credenciais para o `.env`
2. Em **Authentication → Método de login**, ative o provedor **E-mail/senha**
3. (Opcional) Em **Authentication → Modelos**, traduza os e-mails de verificação e de redefinição de senha
4. Crie o banco do **Firestore** e publique as regras de `firestore.rules`:

```sh
firebase deploy --only firestore:rules --project <id-do-projeto>
```

## Testes

Os testes (Vitest + Testing Library) simulam o uso real do app — cadastro, login, funcionários, emissão e histórico de recibos — com o Firebase, as APIs externas e o PDFMake mockados. Não precisam de `.env` nem de conexão.

```sh
pnpm test
```

## Docker

O `.env` precisa existir antes do build, pois o Vite embute as variáveis no bundle.

```sh
pnpm services:up
```

## Licença

[MIT](./LICENSE) © João Vitor
