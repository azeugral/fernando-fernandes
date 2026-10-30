"""Aponta o site para o endereço público: canonical, og:url, og:image, JSON-LD,
sitemap.xml, robots.txt e os caminhos absolutos do 404.html.
Uso:
  python tools/dominio.py https://azeugral.github.io/fernando-fernandes/   (GitHub Pages, padrão atual)
  python tools/dominio.py https://www.seudominio.com.br/                    (domínio próprio)
Rodar de novo sempre que o endereço mudar; o script é idempotente."""
import os, re, sys
from datetime import date
from urllib.parse import urlparse

AQUI = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.dirname(AQUI)
PAGINAS = {'index.html': '', 'portfolio.html': 'portfolio.html'}


def ler(n):
    with open(os.path.join(SITE, n), encoding='utf8') as f:
        return f.read()


def gravar(n, s):
    with open(os.path.join(SITE, n), 'w', encoding='utf8', newline='\n') as f:
        f.write(s)


def main():
    base = (sys.argv[1] if len(sys.argv) > 1 else 'https://azeugral.github.io/fernando-fernandes/').rstrip('/') + '/'
    caminho = urlparse(base).path  # "/fernando-fernandes/" ou "/"

    for pag, rel in PAGINAS.items():
        s = ler(pag)
        url = base + rel
        s = re.sub(r'\s*<link rel="canonical"[^>]*>', '', s)
        s = re.sub(r'\s*<meta property="og:url"[^>]*>', '', s)
        s = s.replace('<meta property="og:type"', f'<link rel="canonical" href="{url}">\n<meta property="og:url" content="{url}">\n<meta property="og:type"', 1)
        s = re.sub(r'<meta property="og:image" content="[^"]*">', f'<meta property="og:image" content="{base}og.jpg">', s)
        s = re.sub(r'<meta name="twitter:image" content="[^"]*">', f'<meta name="twitter:image" content="{base}og.jpg">', s)
        s = re.sub(r'"image": "[^"]*og\.jpg"', f'"image": "{base}og.jpg"', s)
        s = re.sub(r'"url": "[^"]*"', f'"url": "{base}"', s)
        gravar(pag, s)

    s = ler('404.html')
    s = re.sub(r'(href|src)="/[^"]*?(favicon\.ico|assets/css/revista\.css)"', lambda m: f'{m.group(1)}="{caminho}{m.group(2)}"', s)
    s = re.sub(r'(<a class="btn cheio" href=")[^"]*(")', lambda m: f'{m.group(1)}{caminho}{m.group(2)}', s)
    gravar('404.html', s)

    hoje = date.today().isoformat()
    itens = ''.join(f'  <url><loc>{base}{rel}</loc><lastmod>{hoje}</lastmod></url>\n' for rel in PAGINAS.values())
    gravar('sitemap.xml', f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{itens}</urlset>\n')
    gravar('robots.txt', f'User-agent: *\nAllow: /\n\nSitemap: {base}sitemap.xml\n')
    print('endereço:', base)


if __name__ == '__main__':
    main()
