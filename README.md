# 🏛️ Site Cezec 1.0 - Plataforma Institucional

## 📄 Sobre o Projeto

O **Site Cezec 1.0** é uma plataforma web desenvolvida para ser a presença digital oficial da instituição. O objetivo principal deste projeto é apresentar a identidade, os rituais sagrados e os serviços oferecidos (como jogo de búzios e banhos de ervas) de forma respeitosa, visualmente rica e acessível.

Mais do que um site informativo, o projeto busca transmitir a atmosfera do local através de um design cuidadoso e uma galeria de imagens organizada, servindo como ponto de contato entre a liderança (Baba Jonas) e a comunidade.

---

## 🚀 Funcionalidades e Seções

O site foi estruturado para guiar o visitante através de uma jornada de conhecimento:

### 🏠 Página Principal (Home)
- **Apresentação Institucional**: Visão geral sobre o Cezec e sua missão.
- **Destaques Visuais**: Banners rotativos ou estáticos que mostram a beleza do espaço.

### 🌿 Serviços e Rituais
- **Jogo de Búzios**: Seção dedicada à explicação e agendamento/contato para consultas.
- **Banhos de Ervas**: Catálogo visual e explicativo sobre os tipos de banhos e suas finalidades.
- **Assentamentos**: Galeria respeitosa demonstrando os pontos de força da casa.

### 🖼️ Galeria Multimídia
- **Acervo Fotográfico**: Organização de imagens de rituais (como o "bate cabeça") e liderança.
- **Otimização Visual**: Exibição de imagens em alta qualidade sem comprometer o layout.

---

## 💡 Desafios, Problemas e Soluções

Durante o desenvolvimento do front-end deste projeto, enfrentamos desafios específicos relacionados à apresentação de conteúdo visual e responsividade. Abaixo detalhamos como cada obstáculo foi superado:

### 1. Responsividade e Layout Fluido
*   **O Problema**: O site precisava ser acessível tanto em desktops grandes quanto em celulares, sem que as imagens dos rituais perdessem o enquadramento ou o texto ficasse ilegível.
*   **A Solução**: Utilizamos **Media Queries** do CSS3 de forma extensiva. Adotamos uma abordagem *Mobile-First* em componentes críticos, garantindo que o menu de navegação se adapte (transformando-se em menu "hambúrguer" em telas pequenas) e que as grades de imagens (Grid Layout) se reajustem automaticamente de 3 colunas para 1 coluna conforme a largura da tela.

### 2. Gestão de Imagens Pesadas
*   **O Problema**: O projeto possui um acervo visual rico (pastas `assentamentos`, `banhos_ervas`). Carregar todas essas imagens em alta resolução simultaneamente causava lentidão no carregamento inicial da página.
*   **A Solução**: Implementamos técnicas de otimização no CSS e HTML. As imagens foram tratadas para formatos web otimizados. Além disso, a estrutura de pastas foi organizada categoricamente (`img/assentamentos/`, `img/buzios/`) para facilitar a manutenção e a referência no código, garantindo que apenas os assets necessários para cada seção fossem priorizados visualmente.

### 3. Semântica e Acessibilidade (SEO)
*   **O Problema**: Garantir que o site fosse bem interpretado por motores de busca (Google) e leitores de tela, dado o conteúdo específico e cultural.
*   **A Solução**: Uso rigoroso das tags semânticas do **HTML5** (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, `<article>`). Isso não apenas melhorou o SEO, mas também facilitou a estilização global via CSS, evitando o uso excessivo de `divs` genéricas.

### 4. Interatividade sem Frameworks Pesados
*   **O Problema**: Necessidade de adicionar dinamismo (como galerias ou menus interativos) sem tornar o site pesado com bibliotecas externas desnecessárias.
*   **A Solução**: Desenvolvimento de scripts **JavaScript (Vanilla JS)** puros e leves. A lógica de interatividade foi mantida na pasta `js/`, separada da estrutura, garantindo um código limpo e de fácil depuração.

---

## 🛠️ Tecnologias Utilizadas

O projeto foi construído sobre os pilares fundamentais da web moderna, sem dependências complexas de compilação:

- **HTML5**: Para estrutura semântica e acessibilidade.
- **CSS3 (Flexbox & Grid)**: Para estilização avançada, animações sutis e layout responsivo.
- **JavaScript (ES6+)**: Para manipulação do DOM e interatividade do usuário.
- **Git**: Para versionamento e histórico de alterações do código.

---

## 📂 Estrutura do Projeto

A organização dos arquivos foi pensada para escalabilidade e fácil manutenção:

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
