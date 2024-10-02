# Leitor de Medição de Água e Gás

## Descrição do Projeto

Este projeto é uma aplicação web que permite aos usuários fazer upload de imagens de medidores de água ou gás. A aplicação utiliza a API do Google Gemini para analisar as imagens e extrair os valores de medição. O projeto foi desenvolvido como parte de um desafio de vaga, utilizando tecnologias modernas de desenvolvimento web.

## Tecnologias Utilizadas

- [Next.js](https://nextjs.org/) - Framework React para renderização do lado do servidor e geração de sites estáticos
- [Drizzle ORM](https://orm.drizzle.team/) - ORM (Object-Relational Mapping) para TypeScript
- [PostgreSQL](https://www.postgresql.org/) - Banco de dados relacional
- [Docker](https://www.docker.com/) - Plataforma de containerização
- [Google Gemini API](https://cloud.google.com/vertex-ai/docs/generative-ai/model-reference/gemini) - API de inteligência artificial para análise de imagens

## Funcionalidades

- Upload de imagens de medidores de água ou gás
- Análise automática das imagens para extração dos valores de medição
- Armazenamento dos dados de medição no banco de dados
- Gerenciamento de usuários e autenticação

## Estrutura do Projeto

- API Routes do Next.js para manipulação de medições
- Server Actions do Next.js para tarefas relacionadas aos usuários
- Integração com o Google Gemini para análise de imagens
- Banco de dados PostgreSQL executando em um container Docker

## Como Executar o Projeto

1. Clone o repositório
2. Instale as dependências com `npm install`
3. Configure as variáveis de ambiente necessárias
4. Inicie o container Docker com o PostgreSQL
5. Execute as migrações do banco de dados
6. Inicie o servidor de desenvolvimento com `npm run dev`

## Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.

## Licença

[Insira aqui a licença escolhida para o seu projeto]
