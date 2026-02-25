Cezéc — Deploy & Hardening Guide
=================================

Resumo
------
Este README descreve como publicar este site estático no GitHub Pages e como aplicar cabeçalhos de segurança (HSTS, X-Frame-Options, X-Content-Type-Options, CSP, Referrer-Policy, etc.) usando um proxy (recomendado: Cloudflare Worker). O GitHub Pages não permite alterar cabeçalhos HTTP de resposta diretamente; por isso recomendamos o uso do Cloudflare (ou outro CDN/proxy) para impor headers seguros.

1) Publicar no GitHub Pages
---------------------------
- Opção A — Servir da branch `gh-pages` (fácil):

  ```bash
  # a partir da raiz do projeto
  git init
  git add .
  git commit -m "site: initial"
  git branch -M main
  git remote add origin <your-repo-url>
  git push -u origin main

  # criar branch gh-pages que contém a build (opcional)
  git subtree push --prefix . origin gh-pages
  ```

- Opção B — Servir do branch `main` (root) via GitHub Pages settings:
  - Vá em Settings -> Pages no repositório e escolha `main` / `root` ou `gh-pages` conforme preferir.
  - O arquivo `CNAME` presente no repositório define o domínio customizado (se estiver usando `cezec.com.br`). Mantenha-o.

2) Por que usar um proxy/CDN (Cloudflare)
----------------------------------------
- GitHub Pages não permite definir headers de resposta HTTP. Para HSTS, X-Frame-Options, CSP, etc., você precisa de um proxy que modifique headers.
- Cloudflare (modo proxy ON/"orange cloud") encaminha tráfego e permite usar Workers para ajustar headers de resposta.

3) Exemplo: Cloudflare Worker para aplicar headers
-------------------------------------------------
Crie um Worker no painel do Cloudflare e use este código (rote para `cezec.com.br/*`):

```javascript
addEventListener('fetch', event => {
  event.respondWith(handle(event.request))
})

async function handle(request) {
  const resp = await fetch(request)
  const newHeaders = new Headers(resp.headers)

  newHeaders.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
  newHeaders.set('X-Frame-Options', 'SAMEORIGIN')
  newHeaders.set('X-Content-Type-Options', 'nosniff')
  newHeaders.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  newHeaders.set('Permissions-Policy', "geolocation=()")

  newHeaders.set('Content-Security-Policy', "default-src 'self' https:; script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com;")

  newHeaders.set('Access-Control-Allow-Origin', 'https://cezec.com.br')

  return new Response(resp.body, { status: resp.status, statusText: resp.statusText, headers: newHeaders })
}
```

Instruções rápidas no Cloudflare:
- Adicione o domínio `cezec.com.br` ao Cloudflare e atualize os nameservers no provedor DNS (Hostinger, etc.).
- Ative proxy (orange cloud) para os registros DNS que apontam para GitHub Pages.
- No painel Workers, crie um novo Worker, cole o código acima e salve.
- Na aba "Triggers" do Worker, adicione um Route: `cezec.com.br/*`.

4) Testar os headers
---------------------
Use estes comandos para verificar os headers de resposta (local):

PowerShell / Windows:
```powershell
curl.exe -vI https://cezec.com.br
```

macOS / Linux:
```bash
curl -I https://cezec.com.br
```

5) HSTS Preload (opcional)
--------------------------
- Se desejar incluir o site no HSTS preload list, verifique requisitos (serve HSTS com includeSubDomains e max-age >= 10886400 e HTTPS contínuo) e envie em https://hstspreload.org/. Leia atentamente antes de habilitar.

6) Observações e recomendações adicionais
----------------------------------------
- Mantive uma `Content-Security-Policy` básica como meta tag nos HTML, mas cabeçalhos de resposta (via Worker) são a forma correta de reforçar a política.
- Remova ou revise scripts que fazem `document.write` ou inspecionam o console (o `security.js` contém código anti-debug que pode interferir em debugging e em testes). Avalie se deseja mantê-lo em produção.
- Cuidado com `Access-Control-Allow-Origin: *` — se houver endpoints que aceitam credenciais, restrinja a origem.
- Testes: depois de aplicar o Worker, valide com scanners como securityheaders.com e observability via curl.

7) Precisa que eu faça?
----------------------
- Posso: (a) gerar o Worker pronto e deployable, (b) gerar instruções passo-a-passo com capturas de tela para Cloudflare, ou (c) não fazer nada e apenas te orientar. Diga qual opção prefere.

---
Arquivos locais modificados para hardening: `index.html`, `contato.html`, `doacoes.html`, `trajetoria.html`, `trabalhos.html`, `oracoes.html`, `loja_cezec.html`, `servicos.html`, `atendimentos.html`, `js/main.js`, `js/gtag-config.js`.
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

## 💬 Chat IA (assistente virtual)

O projeto inclui um widget de chat (`chat.js`) que provê uma experiência de atendimento automatizado.

- Modo padrão: comportamento local (rule-based) que responde perguntas frequentes, sugere serviços e direciona para o WhatsApp.
- Modo avançado (opcional): integração com um serviço de IA (por exemplo, um endpoint proxy que interage com a OpenAI). Recomendamos usar um proxy server-side para não expor chaves de API no frontend.

Exemplo mínimo de proxy Node.js (Express) — para ser hospedado em um servidor ou função serverless:

```javascript
const express = require('express')
const fetch = require('node-fetch')
const app = express()
app.use(express.json())

app.post('/ai-proxy', async (req, res) => {
  const { prompt } = req.body
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'API key não configurada' })

  const r = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }], max_tokens: 500 })
  })
  const data = await r.json()
  const reply = data.choices && data.choices[0] && data.choices[0].message ? data.choices[0].message.content : 'Desculpe, ocorreu um erro.'
  res.json({ reply })
})

app.listen(process.env.PORT || 3000)
```

Configuração recomendada no frontend:

- Publique o proxy em um domínio/URL que você controle (ex: `https://meu-proxy.example.com/ai-proxy`).
- No HTML, defina uma meta tag ou variável global apontando para o proxy:

```html
<meta name="ai-proxy" content="https://meu-proxy.example.com/ai-proxy">
```

O `chat.js` detecta automaticamente essa configuração e encaminhará mensagens ao proxy. Se nenhum proxy for encontrado, o assistente roda em modo local.

---

Se quiser, eu posso gerar o proxy completo, preparar um deploy serverless (Vercel/Cloudflare Workers) ou ajustar o comportamento do assistente para um tom mais formal ou coloquial. Diga qual opção prefere.
