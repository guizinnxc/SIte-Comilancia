# Vídeos do Hero

O Hero escolhe um vídeo pela largura da tela. Os caminhos estão em `src/content/images.ts` (`heroVideo`):

| Tela | Arquivo | Estado |
| --- | --- | --- |
| Desktop (768 px ou mais) | `comilancia-fundo-desktop.mp4` | Instalado: H.264, 960 × 540 (16:9), 6,1 s, 1,2 MB, sem áudio |
| Celular (abaixo de 768 px) | `comilancia-fundo-celular.mp4` | Instalado: H.264, 540 × 960 (retrato), 6,1 s, 1,3 MB, sem áudio |

Enquanto um arquivo não existir, ou com redução de movimento ativa no sistema, o Hero exibe a fotografia de capa `public/images/hero/cozido-carne-legumes.webp`, com o enquadramento definido em `src/components/Hero.tsx` (`COVER_POSITION`).

## Como adicionar os vídeos

1. Copie os dois arquivos para esta pasta, com exatamente esses nomes.
2. Use H.264 (MP4), sem áudio (o Hero também usa `muted`), e tamanho razoável (cerca de 8 MB ou menos por arquivo). Sem som, use: `ffmpeg -i original.mp4 -an -c:v libx264 -crf 26 -preset slow -movflags +faststart comilancia-fundo-desktop.mp4`.
3. Desktop deve ser horizontal (16:9). O vídeo vertical não deve ser ampliado para preencher o desktop.
4. Não use links temporários do Instagram.

## Testes realizados

Feitos no navegador de testes, em `npm run build` + `npm run preview` (porta 5183):

- **Build e tipos:** `tsc --noEmit` e `vite build` passam.
- **Fallback sem arquivos:** o vídeo de desktop e o de celular não existem; o Hero mostra a capa com o enquadramento correto, sem erro de layout e sem overflow horizontal (375 px e 1024 px).
- **Redução de movimento ativa:** o Hero mostra a capa, sem vídeo, em desktop e celular.
- **Seleção por tela:** em desktop, só `comilancia-fundo-desktop.mp4` é solicitado; em celular, só `comilancia-fundo-celular.mp4`.
- **Reprodução (teste com arquivo provisório):** com redução de movimento emulada como "sem preferência" somente no navegador de testes, um arquivo provisório de 720 × 1280 foi tocado com `autoplay`, `muted`, `loop` e `playsinline`; o tempo de reprodução avançou e o vídeo não pausou.
- **Captura visual:** o Hero foi visto em desktop (800 × 600) e celular (375 × 812). O texto, os botões, o menu e o horário ficaram legíveis, sem sobreposição com o logotipo.

## Não verificado

- **Reprodução dos vídeos definitivos:** testada no navegador de testes, com `muted`, `loop` e avanço do tempo confirmados, em desktop (960 × 540) e celular (540 × 960). Não foi testada em outros navegadores nem em aparelhos reais.
- **Enquadramento e legibilidade:** conferidos em uma captura de desktop e outra de celular. Em desktop, a área clara atrás do título ainda reduz um pouco o contraste; `object-position` e a camada escura podem ser ajustados se preferir.
- **Textos sobre fundo claro:** o teste com o arquivo provisório mostrou áreas claras atrás do título no desktop; a legibilidade com o vídeo final deve ser conferida.
- **Marca d'água no arquivo provisório:** o vídeo provisório traz um texto "@restaurantecomilancia" sobreposto ao quadro. Confirme que os vídeos definitivos não têm marca d'água do Instagram.
- **Pôster extraído do vídeo:** não foi gerado, porque não há ffmpeg instalado. A capa usada é a fotografia atual.
- **Desempenho:** não medido em conexão lenta.

## Pendências

- **Autorização (não é tarefa técnica):** o restaurante ainda não confirmou por escrito que autoriza o uso dos vídeos. O projeto foi descrito como ilustrativo, mas isso não substitui a autorização. Antes de qualquer publicação real, confirme com o restaurante e registre aqui.
- **Marca d'água nos vídeos:** o quadro mostra um texto "@restaurantecomilancia" discreto no canto superior direito. Confirme se é aceitável ou se há uma versão sem ele.
- Confirmar a capa de desktop e a de celular. Hoje as duas usam a mesma fotografia, `cozido-carne-legumes.webp`, em enquadramentos diferentes.
