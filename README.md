# My Future

Site de orientação para o pós-ensino médio.

## Como executar
Abra `index.html` no navegador ou use a extensão **Live Server** do VS Code. Clique no botão de reprodução para tocar **My Future — Billie Eilish**.

## Organização
- `index.html` e demais páginas HTML: páginas do site.
- `css/`: folhas de estilo.
- `js/script.js`: lógica do player (play/pause, duração e progresso).
- `assets/images/`: banner, ícones e GIF.
- `assets/audio/`: arquivo MP3.

## Correções
- Inclusão do `<script src="js/script.js" defer></script>` na página inicial (estava ausente).
- Ajuste das referências após mover CSS, imagens e MP3.
- Barra de progresso, duração e estado do botão sincronizados com o áudio.
- Tratamento de erros de reprodução e ausência de autoplay forçado.

**Observação:** `css/concurso.css` e `css/tecnico.css` já estavam vazios no material original, e foram mantidos.
