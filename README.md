# 🏛️ Site Cezec 1.0 - Plataforma Institucional

## 📄 Sobre o Projeto

O **Site Cezec 1.0** é a presença digital oficial da Casa Espiritual Zé Corisco. O projeto foi desenvolvido para centralizar informações sobre a trajetória da casa, atendimentos espirituais, trabalhos realizados e orações, oferecendo um canal direto de comunicação via WhatsApp e redes sociais.

A estrutura foi pensada para ser leve, direta e acessível, utilizando tecnologias web padrão para garantir compatibilidade e desempenho, com foco na conversão e contato direto.

---

## 🚀 Funcionalidades e Estrutura

O site é composto por diversas páginas interligadas que cobrem os pilares da instituição:

### 🏠 Página Principal (`index.html`)
- **Apresentação**: Visão geral sobre a Casa Espiritual Zé Corisco.
- **Navegação Central**: Menu responsivo com acesso a todas as áreas.
- **Integração Social**: Links diretos para Instagram, TikTok e WhatsApp.
- **Botão Flutuante**: Acesso rápido ao chat via WhatsApp (`chat.js`).

### 🌿 Seções do Site (Páginas)
- **Trajetória (`trajetoria.html`)**: História e missão da casa.
- **Atendimentos (`atendimentos.html`)**: Informações sobre consultas e horários.
- **Trabalhos (`trabalhos.html`)**: Detalhes sobre os rituais e serviços espirituais.
- **Orações (`oracoes.html`)**: Espaço dedicado à fé e preces.
- **Doações (`doacoes.html`)**: Informações sobre como contribuir com a casa.
- **Contato (`contato.html`)**: Formulário e dados de contato.

### 🛡️ Scripts e Segurança
- **Chat (`chat.js`)**: Gerencia a lógica do botão flutuante de WhatsApp.
- **Segurança (`security.js`)**: Implementa medidas de proteção no frontend.
- **Analytics**: Integração com Google Tag Manager para métricas de acesso.

---

## 💡 Desafios, Problemas e Soluções

Durante o desenvolvimento do front-end deste projeto, enfrentamos desafios específicos relacionados à integração de scripts externos, responsividade e segurança. Abaixo detalhamos como cada obstáculo foi superado:

### 1. Responsividade e Menu Mobile
*   **O Problema**: O site precisava ser acessível em dispositivos móveis sem depender de frameworks pesados como Bootstrap. O menu de navegação precisava se adaptar elegantemente.
*   **A Solução**: Implementamos um menu "hambúrguer" utilizando **JavaScript Puro (Vanilla JS)** e CSS. O script detecta o clique no ícone `.hamburger` e alterna a classe `.active` no menu `.nav-menu`, garantindo uma transição suave sem carregar bibliotecas externas. O código foi otimizado para rodar após o carregamento do DOM (`DOMContentLoaded`).

### 2. Integração de Chat sem Bloqueio
*   **O Problema**: A necessidade de um botão de chat flutuante (`whatsapp-float`) que não interferisse na performance inicial da página.
*   **A Solução**: A lógica do chat foi isolada no arquivo `chat.js` e carregada no final do `<body>`. Isso garante que o conteúdo principal (HTML/CSS) seja renderizado primeiro, melhorando a métrica de *First Contentful Paint* (FCP).

### 3. Segurança no Front-end
*   **O Problema**: Proteger o conteúdo e garantir a integridade da navegação contra scripts maliciosos básicos ou cópias indesejadas.
*   **A Solução**: Criação do arquivo `security.js`, que centraliza as regras de segurança do cliente, mantendo o código principal limpo e focado na apresentação.

### 4. Gestão de Estilos Globais
*   **O Problema**: Manter a consistência visual entre todas as páginas (`index`, `trajetoria`, `contato`, etc.) sem duplicar código CSS.
*   **A Solução**: Centralização de todos os estilos no arquivo `style.css` na raiz do projeto. O uso de variáveis CSS (se aplicável) e classes utilitárias permitiu que alterações no design (como cores da marca) fossem propagadas instantaneamente para todas as páginas.

---

## 🛠️ Tecnologias Utilizadas

O projeto foi construído sobre os pilares fundamentais da web moderna:

- **HTML5**: Estrutura semântica e SEO (Meta tags Open Graph configuradas).
- **CSS3**: Estilização responsiva, Flexbox e animações.
- **JavaScript (ES6+)**: Lógica de interação (`chat.js`, `security.js`, menu mobile).
- **Google Analytics/Ads**: Monitoramento de tráfego e conversões.

---

## 📂 Estrutura de Arquivos

A organização reflete a simplicidade e eficiência do projeto estático:

```
Site Cezec 1.0/
├── index.html             # Página Principal (Landing Page)
├── sobre.html             # (Opcional) Página detalhada sobre a instituição
├── servicos.html          # (Opcional) Detalhamento dos serviços
├── css/
│   ├── style.css          # Estilos globais e reset
│   ├── responsive.css     # Regras específicas para mobile/tablet
│   └── animations.css     # Animações de entrada e transição
├── js/
│   ├── main.js            # Script principal (Menu, Scroll)
│   └── gallery.js         # Lógica específica para visualização de imagens
├── img/
│   ├── assentamentos/     # Fotos dos assentamentos
│   ├── banhos_ervas/      # Fotos dos banhos preparados
│   ├── buzios/            # Imagens relacionadas ao jogo
│   ├── baba_jonas.jpeg    # Foto oficial da liderança
│   └── bate_cabeça.jpeg   # Registro de rituais
└── README.md              # Documentação do projeto
