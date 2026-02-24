# 🏛️ Site Cezec 1.0  
## Plataforma Institucional — Casa Espiritual Zé Corisco

---

## 📌 Visão Geral do Projeto

O **Site Cezec 1.0** é uma aplicação web estática desenvolvida para representar digitalmente a Casa Espiritual Zé Corisco.

O projeto foi idealizado para consolidar a presença digital da instituição, centralizar informações institucionais e facilitar o contato direto com o público por meio de WhatsApp e redes sociais.

A arquitetura prioriza:

- ⚡ Alta performance
- 🧩 Simplicidade estrutural
- 🔒 Controle total do código
- 🚀 Facilidade de deploy
- 📱 Responsividade nativa

---

# 🎯 Objetivos do Projeto

- Apresentar a trajetória e missão da instituição
- Informar sobre atendimentos espirituais
- Divulgar trabalhos realizados
- Disponibilizar orações
- Permitir contribuições via doações (PIX)
- Facilitar conversão direta via WhatsApp
- Garantir compatibilidade total com dispositivos móveis

---

# 🧠 Arquitetura da Aplicação

O projeto segue o modelo **MPA (Multi Page Application)**.

Não há backend integrado. Toda a lógica é executada no lado do cliente (client-side).

## 📂 Estrutura de Arquivos

```text
Site Cezec 1.0/
├── index.html
├── atendimentos.html
├── contato.html
├── doacoes.html
├── loja_cezec.html
├── oracoes.html
├── servicos.html
├── trabalhos.html
├── trajetoria.html
├── chat.js
├── security.js
├── style.css
├── .htaccess
├── CNAME
├── img/
└── README.md
```

---

# 🏗️ Decisões Técnicas

## 1️⃣ Projeto 100% Estático

### Decisão:
Não utilizar frameworks como React, Vue, Angular ou Bootstrap.

### Justificativa:
- Redução de dependências
- Melhor tempo de carregamento
- Maior controle estrutural
- Hospedagem simplificada (GitHub Pages / Apache)

---

## 2️⃣ Uso de JavaScript Puro (Vanilla JS)

Arquivos principais:

- `chat.js`
- `security.js`

### Motivo:
- Código mais leve
- Menor risco de vulnerabilidades externas
- Maior domínio técnico da aplicação
- Independência de bibliotecas externas

---

## 3️⃣ Centralização de Estilos

Todos os estilos estão concentrados em:

## style.css


Benefícios:

- Padronização visual entre todas as páginas
- Manutenção simplificada
- Atualização global de identidade visual

---

# 🛡️ Segurança Implementada

## 🔐 Segurança no Front-End (`security.js`)

Medidas aplicadas:

- Bloqueio de clique direito
- Bloqueio de atalhos como:
  - F12
  - Ctrl+Shift+I
  - Ctrl+U
  - Ctrl+Shift+C
- Tentativas de dificultar inspeção casual

⚠️ Observação:
Essas medidas não substituem segurança de servidor, mas reduzem inspeções básicas por usuários leigos.

---

## 🛡️ Segurança no Servidor (`.htaccess`)

O arquivo `.htaccess` permite:

- Controle de diretórios
- Possíveis regras de cache
- Proteção básica contra hotlink
- Configurações específicas para ambiente Apache

Indica preocupação com integridade e organização do ambiente de hospedagem.

---

# 📱 Responsividade

A responsividade foi desenvolvida manualmente utilizando:

- CSS Flexbox
- Media Queries
- Layout fluido

## Desafio Enfrentado:
Criar menu responsivo sem uso de frameworks.

## Solução:
Implementação manual de menu hambúrguer com JavaScript puro.

Resultado:

- Código leve
- Sem dependência externa
- Total controle de comportamento

---

# ⚡ Performance

Estratégias adotadas:

- Aplicação totalmente estática
- JavaScript carregado ao final do `<body>`
- Ausência de bibliotecas pesadas
- Estrutura HTML limpa
- Organização eficiente de imagens

Impacto:

- Melhor First Contentful Paint (FCP)
- Carregamento rápido
- Melhor ranqueamento em SEO

---

# 📈 SEO e Indexação

Boas práticas aplicadas:

- Estrutura HTML semântica
- Organização clara de conteúdo
- Separação de páginas por tema
- Configuração de `CNAME` para domínio personalizado
- Potencial uso de meta tags Open Graph

---

# 💬 Estratégia de Conversão

O projeto foi estruturado com foco em conversão direta.

Principais canais:

- Botão flutuante de WhatsApp
- Links para redes sociais
- QR Code PIX para doações

Objetivo:

Reduzir fricção e facilitar contato imediato com a instituição.

---

# 🧩 Principais Desafios Enfrentados
```
## 1️⃣ Garantir leveza sem framework

Solução:
Arquitetura enxuta com HTML, CSS e JS puro.

---

## 2️⃣ Responsividade manual

Solução:
Uso estratégico de Flexbox e Media Queries.

---

## 3️⃣ Proteção básica de conteúdo

Solução:
Implementação de regras em `security.js`.

---

## 4️⃣ Organização multipágina

Solução:
Padronização estrutural entre todos os arquivos HTML.

---
```

# 📊 Pontos Fortes do Projeto

✔ Código organizado  
✔ Arquitetura limpa  
✔ Alta performance  
✔ Baixa complexidade estrutural  
✔ Fácil manutenção  
✔ Pronto para deploy imediato  
✔ Independente de backend  

---

# 🔮 Roadmap Futuro (Versão 2.0)

- Implementação de backend para formulário funcional
- Sistema administrativo
- Minificação automática de CSS/JS
- Lazy Loading de imagens
- Sitemap.xml
- Robots.txt
- Compressão otimizada de imagens
- Transformação em PWA
- Estrutura modular escalável

---

# 📌 Informações Técnicas

- Versão: 1.0
- Tipo: Aplicação Web Estática
- Arquitetura: MPA (Multi Page Application)
- Stack: HTML5 + CSS3 + JavaScript ES6
- Ambiente compatível: Apache / GitHub Pages

---

# 🧠 Lições Técnicas Aprendidas

- Nem todo projeto precisa de framework
- Organização supera complexidade
- Performance começa na arquitetura
- Segurança client-side é complementar
- Simplicidade bem aplicada gera robustez

---

# 📜 Licença

Projeto desenvolvido para uso institucional da Casa Espiritual Zé Corisco.

---
