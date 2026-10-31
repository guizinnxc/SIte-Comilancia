# Restaurante Comilância: site institucional

Site em React, TypeScript, Tailwind CSS e Framer Motion para o Restaurante
Comilância, em Miguel Pereira, RJ.

## Como rodar

Requisitos: Node.js 18 ou superior.

```bash
npm install
npm run dev
```

Abra http://localhost:5173.

## Gerar a versão de produção

```bash
npm run build
npm run preview
```

## Onde editar o conteúdo

Quase tudo o que aparece no site está em [src/content/site.ts](src/content/site.ts):

- **Dados do restaurante**: nome, endereço, telefone, WhatsApp, Instagram, cardápio e horário.
- **Imagens principais**: caminhos e textos alternativos (`images`).
- **Gastronomia**: os três cartões. Os textos são genéricos e devem ser revisados.
- **Cardápio próprio**: a lista `menuCategories` fica vazia por enquanto. Ao preenchê-la, o site exibe o cardápio direto na página, no lugar do botão para o cardápio oficial.
- **Galeria**: a lista `gallery`. Adicione um item com `id`, `src`, `alt`, `caption` e `category`.
- **Avaliações**: a lista `reviews`. Inclua somente avaliações reais, verificadas e com fonte. Enquanto estiver vazia, a seção mostra uma mensagem de espera.

Os textos de história, experiência e a frase de cada seção estão nos próprios
componentes em `src/components/`.

## Fotografias

Coloque as imagens oficiais em `public/images/` com os nomes listados em
[public/images/LEIA-ME.md](public/images/LEIA-ME.md). Enquanto um arquivo não
existir, o site mostra um quadro neutro no lugar, sem quebrar o layout.

## Antes de publicar

- Revisar os textos marcados como genéricos e confirmar horário, endereço e telefone.
- Trocar o favicon (`public/favicon.svg`) e a imagem de compartilhamento (`public/images/og-cover.jpg`).
- Confirmar o domínio em `index.html` (canonical, Open Graph e dados estruturados) e em `public/sitemap.xml`.
- Otimizar as fotografias antes de subir.
