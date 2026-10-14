# Fernando Fernandes · Tatuador premiado

Site de apresentação do tatuador **Fernando Fernandes** (@fernandofernandestattoo), preto e cinza / blackwork, Bom Retiro, São Paulo.

Versão 2 (14/10/2026), redesenhada a partir de sites premiados de tatuadores (Rui Tattoo e Vitalina no Awwwards, Dr. Woo):

- **Hero** em tela cheia sem foto: uma fumaça de tinta em preto e cinza gerada em WebGL (nítida em qualquer tela), que o cursor ilumina e mexe; no celular a luz passeia sozinha. Sem WebGL fica um degradê. Por cima, o nome gigante ajustado à largura e três informações em linha.
- **Portfólio** em grade rígida 4:5 (4, 3 ou 2 colunas), numerado, com filtros e tela cheia. São 72 obras, para a grade fechar certinha.
- Seções: Sobre, Portfólio, Destaque (3º lugar na Coliseu Expo Tattoo), Processo + guia da sessão longa, Serviços, Além da tattoo, Avaliações, Orçamento (vira mensagem no WhatsApp) e Contato.
- Playfair condensada + IBM Plex Sans + JetBrains Mono; tinta, papel e vermelho de prova.

Páginas: `index.html`, `portfolio.html` (72 obras), `404.html`.

## Fontes do conteúdo

- Instagram, 168 posts mais recentes (14/10/2026): bio, legendas e fotos.
- Perfil do Google: endereço, telefone, nota 5,0 com 21 avaliações, descrição.

Tudo no site vem do Instagram dele (bio e legendas) ou da ficha do Google, que tem o mesmo telefone do Instagram. Foram retirados por não serem dele: a matéria do g1 (outro Fernando Fernandes, de Praia Grande), a "mentoria" (no post ele era o aluno) e "passou por estúdios conceituados" (texto da irmã).

## Ferramentas

- `tools/processar.py` gera `assets/obras`, `assets/js/obras.js`, `assets/img`, favicons e `og.jpg` a partir de `../_ref/ig` (fora do repositório). Para trocar o portfólio, edite a lista `PORTFOLIO` e rode `python tools/processar.py`.

## CONFIRMAR antes do domínio

1. **Estúdio**: o Google mostra Rua Solon, 191, Bom Retiro. O nome do estúdio é Sutura Ink (@sutura.ink)? Uma legenda cita "Bom Retiro / Carapicuíba": atende nos dois lugares?
2. **Horário de atendimento**: o site diz só "com hora marcada".
3. **Fechamento de braço em uma sessão por R$ 1.300**: veio de um post. Continua valendo? (Antes houve uma campanha de R$ 999.)
4. **Textos do Sobre e do Processo**: foram montados a partir das legendas e da descrição do Google. Ele precisa ler e aprovar.
5. **Além da tattoo**: gravura no vidro, móveis e artes disponíveis estão à venda de verdade?
6. Logo: ele não tem logo além do nome. O monograma "FF" do favicon foi feito para o site.
7. Domínio e remoção do `noindex` quando for ao ar.
