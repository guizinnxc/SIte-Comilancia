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

## Testes

```bash
npm test
```

Os testes de regressão ficam em `tests/` e rodam no Google Chrome instalado na
máquina. Eles sobem o site sozinhos, na porta 5199.

## Onde editar o conteúdo

Quase tudo o que aparece no site está em [src/content/site.ts](src/content/site.ts):

- **Dados do restaurante**: nome, endereço, telefone, WhatsApp, Instagram, cardápio e horário.
- **Gastronomia**: os três cartões. Os textos são genéricos e devem ser revisados.
- **Cardápio próprio**: a lista `menuCategories` fica vazia por enquanto. Ao preenchê-la, o site exibe o cardápio direto na página, abaixo dos cartões de gastronomia. O link do cardápio japonês continua no cartão.
- **Avaliações**: a lista `reviews`. Inclua somente avaliações reais, verificadas e com fonte. Enquanto estiver vazia, a seção mostra uma mensagem de espera.

As fotografias estão em [src/content/images.ts](src/content/images.ts):

- **Imagens principais**: caminhos e textos alternativos (`images`).
- **Galeria**: a lista `galleryPhotos`. Adicione um item com `id`, `src`, `alt`, `caption` e `category`.

Os textos de história e a frase de cada seção estão nos próprios componentes em
`src/components/`.

## Fotografias

Coloque as imagens oficiais em `public/images/` com os nomes listados em
[docs/fotografias.md](docs/fotografias.md). Enquanto um arquivo não existir, o
site mostra um quadro neutro no lugar, sem quebrar o layout.

As notas internas ficam em `docs/`, e as fotos recebidas em `fotos-instagram/`:
tudo o que está em `public/` é publicado com o site.

## Antes de publicar

- Revisar os textos marcados como genéricos e confirmar horário, endereço e telefone.
- Trocar o favicon (`public/favicon.svg`) e, se houver arte própria, a imagem de compartilhamento (`public/images/og-cover.jpg`, hoje um recorte da fotografia de abertura).
- Confirmar o domínio em `index.html` (canonical, Open Graph e dados estruturados) e em `public/sitemap.xml`.
- Otimizar as fotografias antes de subir.
