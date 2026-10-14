# Fernando Fernandes · Tattoo / Art / Culture

Site de apresentação do tatuador **Fernando Fernandes** (@fernandofernandestattoo), preto e cinza / blackwork, Bom Retiro, São Paulo.

Conceito: o site é uma **revista**. Ele mesmo publica no Instagram uma capa de revista com o próprio nome ("Tattoo / Art / Culture", Vol. 12), então a identidade parte daí: masthead em Playfair condensada, papel e tinta, um vermelho de prova.

- **Capa** com três edições trocáveis (Nº 12, 11 e 10), foto sobrepondo o nome como numa capa impressa.
- **Sumário** com fólio de página, e um fólio corrente no canto da tela que acompanha a leitura.
- **Matéria de capa** (3º lugar na Coliseu Expo Tattoo), **Portfólio** com filtros e tela cheia, **Entrevista**, **Guia da sessão longa** (texto do próprio post dele), **Serviços** em formato de anúncio, **Classificados** (vidro, móveis, sax), clipping do g1, **Cartas do leitor** (avaliações do Google) e **Cupom de orçamento** que vira mensagem no WhatsApp.

Páginas: `index.html`, `portfolio.html` (78 obras), `404.html`.

## Fontes do conteúdo

- Instagram, 168 posts mais recentes (14/10/2026): bio, legendas e fotos.
- Perfil do Google: endereço, telefone, nota 5,0 com 21 avaliações, descrição.
- g1, 13/03/2023: matéria do pedido de casamento tatuado.

## Ferramentas

- `tools/processar.py` gera `assets/obras`, `assets/js/obras.js`, `assets/img`, favicons e `og.jpg` a partir de `../_ref/ig` (fora do repositório). Para trocar o portfólio, edite a lista `PORTFOLIO` e rode `python tools/processar.py`.

## CONFIRMAR antes do domínio

1. **Estúdio**: o Google mostra Rua Solon, 191, Bom Retiro. O nome do estúdio é Sutura Ink (@sutura.ink)? Uma legenda cita "Bom Retiro / Carapicuíba": atende nos dois lugares?
2. **Horário de atendimento**: o site diz só "com hora marcada".
3. **Fechamento de braço em uma sessão por R$ 1.300**: veio de um post. Continua valendo? (Antes houve uma campanha de R$ 999.)
4. **Matéria do g1 (2023)**: o tatuador da reportagem tinha estúdio em Praia Grande. É ele mesmo? O Facebook dele também cita Praia Grande.
5. **Entrevista**: as respostas foram montadas a partir das legendas dele. Ele precisa ler e aprovar.
6. **Foto "do outro lado"** (post do TBT premiando): confirmar que é ele na foto e qual evento foi.
7. **Mentoria e aulas de preto e cinza**: seguem abertas? Tem valor ou página própria?
8. **Classificados**: gravura no vidro, móveis e artes disponíveis estão à venda de verdade?
9. **Edições da capa** (setembro e agosto): são fictícias, só para a troca de capa. Pode trocar as fotos e chamadas.
10. Logo: ele não tem logo além do nome na capa. O monograma "FF" do favicon foi feito para o site.
11. Domínio e remoção do `noindex` quando for ao ar.
