"""Gera as imagens do site a partir de ../_ref/ig (Instagram @fernandofernandestattoo, 14/10/2026).
- portfólio em assets/obras (640 e 1280 px) + assets/js/obras.js
- fotos de apoio em assets/img, favicons e og.jpg
Uso: python tools/processar.py"""
import os, json
from PIL import Image, ImageDraw, ImageFont, ImageOps

AQUI = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.dirname(AQUI)
IG = os.path.join(os.path.dirname(SITE), '_ref', 'ig')
IMG = os.path.join(SITE, 'assets', 'img')
OBRAS = os.path.join(SITE, 'assets', 'obras')

# id do post -> (categoria, legenda)
PORTFOLIO = [
    (2, 'fech', 'Costas: Jesus e o leão, finalizadas'),
    (0, 'fech', 'Braço do Halaf'),
    (4, 'real', 'Onça em preto e cinza'),
    (52, 'fech', 'Máscara Hannya, costas inteiras'),
    (5, 'fech', 'Samurai, fechamento de braço'),
    (16, 'real', 'Van Gogh autoral'),
    (14, 'real', 'Ayrton Senna'),
    (38, 'fech', 'Jesus e o leão, primeira sessão'),
    (3, 'fech', 'Braço em preto e cinza'),
    (24, 'fech', 'Fechamento total, mais uma sessão'),
    (19, 'real', 'Medusa'),
    (20, 'real', 'Águia'),
    (28, 'real', 'Anjo guerreiro'),
    (22, 'fech', 'Anjo e São Bento'),
    (56, 'real', 'Bastet'),
    (50, 'real', 'Fechamento com caveiras, primeira sessão'),
    (51, 'fech', 'Leão, fechamento de costas'),
    (45, 'cob', 'Cobertura retocada e finalizada'),
    (54, 'real', 'Medusa com flores'),
    (57, 'real', 'Santa Morte'),
    (39, 'real', 'Arte autoral para a Ana'),
    (31, 'fech', 'Lobo, braço em andamento'),
    (18, 'fech', 'Fechamento de braço concluído'),
    (25, 'fech', 'Floral em uma sessão'),
    (53, 'fech', 'Leão na perna'),
    (47, 'fech', 'Corvo, primeira sessão de perna'),
    (43, 'fech', 'Ornamental unindo flashes'),
    (49, 'fech', 'Primeira sessão de fechamento'),
    (61, 'cob', 'Cobertura: preto puro para neutralizar'),
    (55, 'black', 'Suminagashi'),
    (162, 'black', 'Caveira e morcego no peito'),
    (147, 'black', 'Tribal cyberpunk'),
    (159, 'black', 'Flor em blackwork'),
    (65, 'fine', 'Senhor dos Anéis'),
    (32, 'fine', 'Invictus'),
    (34, 'fine', 'Inefável'),
    (48, 'fine', 'Faith in God'),
    (40, 'fine', 'Não me julgue pela coragem que te falta'),
    (66, 'fine', 'Fênix na coluna'),
    (69, 'fine', 'Floral nas costas'),
    (29, 'fine', 'Rosa e serpente'),
    (11, 'fine', 'Floralzinho'),
    (63, 'fine', 'Floral delicado'),
    (76, 'fine', 'Borboleta'),
    (87, 'fine', 'Pai Nosso em árabe'),
    (60, 'black', 'Caveira e rosa'),
    (59, 'black', 'Aranha'),
    (71, 'real', 'Soldado'),
    (74, 'fech', 'Samurai, segunda sessão'),
    (83, 'real', 'Iemanjá e machado de Xangô'),
    (79, 'black', 'Ornamental'),
    (82, 'real', 'Anjo e medalha de São Bento'),
    (70, 'cob', 'Faixa floral com cobertura'),
    (77, 'cob', 'Cobertura, antes e depois'),
    (81, 'cob', 'Reforma com fênix'),
    (97, 'cob', 'Cobertura total do braço, cicatrizada'),
    (99, 'cob', 'Reforma e continuação de braço'),
    (122, 'cob', 'Dragão: a índia e o lobo sumiram'),
    (104, 'real', 'Pirata'),
    (113, 'real', 'Marinheiro'),
    (105, 'real', 'Tigre'),
    (123, 'real', 'Lobo e mulher'),
    (130, 'cob', 'Cobertura com Cristo'),
    (139, 'cob', 'Cobertura de Gotham, primeira sessão'),
    (143, 'cob', 'Reforma com rosa'),
    (137, 'real', 'Leão blackwork'),
    (138, 'real', 'Leão'),
    (136, 'real', 'Mulher e serpente'),
    (135, 'real', 'Retrato com ornamento'),
    (145, 'fech', 'Costas no freehand, primeira sessão'),
    (153, 'black', 'Geométrico unificando o braço'),
    (154, 'fech', 'Foo dog cicatrizado'),
    (160, 'real', 'Mileena, Mortal Kombat'),
    (161, 'real', 'Arte dos arquivos'),
    (163, 'fech', 'Coliseu Expo Tattoo: 9 horas de sessão'),
    (119, 'fine', 'Enjoy the Silence'),
    (114, 'fine', 'Fineline'),
    (166, 'black', 'Cicatrizado'),
]

# fotos de apoio: nome -> (id, recorte relativo ou None, larguras, p&b)
APOIO = {
    'capa-leao': (2, None, (720, 1400), False),
    'capa-hannya': (52, (0.08, 0, 0.92, 1), (720, 1400), False),
    'capa-onca': (4, None, (720, 1400), False),
    'fer-maquina': (131, None, (720, 1200), True),
    'fer-estudio': (128, (0, .12, 1, .92), (640, 1000), False),
    'fer-mesa': (165, None, (640, 1000), False),
    'fer-chapeu': (117, None, (640, 1000), True),
    'fer-guitarra': (100, None, (640, 1000), False),
    'fer-sax': (8, None, (640, 1000), True),
    'fer-retrato': (64, None, (640, 1000), False),
    'premio': (151, None, (640, 1000), False),
    'premiando': (37, None, (640, 1000), True),
    'mesa-vidro': (127, None, (640, 1000), False),
    'arte-vidro': (108, (0, .38, 1, 1), (640, 1000), False),
    'estudio': (106, None, (640, 1000), False),
    'estudio-luz': (121, None, (640, 1000), True),
    'anti-heroi': (141, None, (480, 800), False),
}


def abrir(i):
    return Image.open(os.path.join(IG, f'{i:03d}.jpg')).convert('RGB')


def salvar(im, pasta, nome, larguras, q=80):
    for w in larguras:
        c = im.copy()
        if c.width > w:
            c = c.resize((w, round(c.height * w / c.width)), Image.LANCZOS)
        c.save(os.path.join(pasta, f'{nome}-{w}.webp'), 'WEBP', quality=q, method=6)


def recortar(im, r):
    if not r:
        return im
    W, H = im.size
    return im.crop((round(r[0] * W), round(r[1] * H), round(r[2] * W), round(r[3] * H)))


def main():
    dados = []
    for i, cat, leg in PORTFOLIO:
        im = abrir(i)
        nome = f'o{i:03d}'
        salvar(im, OBRAS, nome, (640, 1280))
        dados.append({'f': nome, 'c': cat, 't': leg, 'r': round(im.width / im.height, 3)})
    with open(os.path.join(SITE, 'assets', 'js', 'obras.js'), 'w', encoding='utf8') as f:
        f.write('window.OBRAS=' + json.dumps(dados, ensure_ascii=False, separators=(',', ':')) + ';\n')

    for nome, (i, r, larg, pb) in APOIO.items():
        im = recortar(abrir(i), r)
        if pb:
            im = ImageOps.grayscale(im).convert('RGB')
        salvar(im, IMG, nome, larg)

    # favicon: monograma FF
    fonte = ImageFont.truetype('georgiab.ttf', 300)
    fav = Image.new('RGB', (512, 512), (14, 13, 12))
    d = ImageDraw.Draw(fav)
    d.text((256, 270), 'FF', font=fonte, fill=(236, 230, 218), anchor='mm')
    fav.resize((32, 32), Image.LANCZOS).save(os.path.join(SITE, 'favicon-32.png'))
    fav.resize((180, 180), Image.LANCZOS).save(os.path.join(SITE, 'apple-touch-icon.png'))
    fav.save(os.path.join(SITE, 'favicon.ico'), sizes=[(16, 16), (32, 32), (48, 48)])

    # og.jpg 1200x630: capa da revista
    og = Image.new('RGB', (1200, 630), (14, 13, 12))
    foto = ImageOps.fit(abrir(2), (560, 630), centering=(.5, .45))
    og.paste(foto, (640, 0))
    d = ImageDraw.Draw(og)
    f1 = ImageFont.truetype('georgia.ttf', 84)
    f2 = ImageFont.truetype('arial.ttf', 26)
    d.text((60, 150), 'FERNANDO', font=f1, fill=(236, 230, 218))
    d.text((60, 245), 'FERNANDES', font=f1, fill=(236, 230, 218))
    d.text((62, 370), 'TATUADOR PREMIADO · PRETO E CINZA', font=f2, fill=(200, 60, 40))
    d.text((62, 412), 'Bom Retiro, São Paulo', font=f2, fill=(170, 165, 155))
    og.save(os.path.join(SITE, 'og.jpg'), quality=86)
    print(len(dados), 'obras')


if __name__ == '__main__':
    main()
