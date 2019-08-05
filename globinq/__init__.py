__version__ = "1.0.0"
__version_info__ = tuple(
    [
        int(num) if num.isdigit() else num
        for num in __version__.replace("-", ".", 1).split(".")
    ]
)

from _collections import defaultdict


globin_groups = ["P", "N", "O", "Q"]

cod_reducido = defaultdict(lambda: defaultdict(lambda: {}))

# cod_reducido["lt"][274] = {"A":["A","L","G","L","C","I","M","T","V","R","S"],"W":["W","F"]}  H12, pero no esta en el sitio!
cod_reducido["lt"][266] = {}  # sin cod
cod_reducido["lt"][85] = {}  # sin cod
cod_reducido["lt"][270] = {}  # sin cod

cod_reducido["lt"][114] = {"V": ["V", "I", "L", "M", "A", "C", "D"]}  # No esta en el excel...
cod_reducido["lt"][278] = {"V": ["V", "A", "G", "S", "T"], "I": ["I", "L", "M", "L"], "Y": ["Y", "F"],
                           "K": ["K", "R"]}  # Es H16, pero no esta en LT...

cod_reducido["lt"][190] = {"D": ["D", "E", "Q", "N"], "Y": ["Y", "F", "W"], "M": ["M", "L", "I"],
                           "G": ["G", "S", "A", "T", "V"]}
cod_reducido["lt"][186] = {"V": ["V", "G", "A", "T", "C", "S"], "I": ["I", "L", "F", "M"], "N": ["N", "Q"]}
cod_reducido["lt"][249] = {"V": ["V", "T", "I", "A", "L"]}

cod_reducido["g8"][278] = cod_reducido["lt"][278]  # H16 no esta en G8
# cod_reducido["g8"][270] = cod_reducido["lt"][278]  # Agregado
cod_reducido["g8"][249] = cod_reducido["lt"][249]
cod_reducido["g8"][250] = {"T": ["T", "V", "G", "A", "S"], "M": ["M", "L", "I"], "E": ["E", "Q"], "Y": ["Y", "F"]}

cod_reducido["e7"][122] = {"I": ["I", "L"]}
cod_reducido["e7"][182] = {"I": ["I", "L"], "E": ["E", "Q"], "V": ["V", "A"]}
cod_reducido["e7"][186] = {"A": ["A", "V", "G"], "S": ["S", "T"]}
# cod_reducido["e7"][155] = cod_reducido["e7"][122]  # Agregado

cod_reducido["sa"][122] = cod_reducido["e7"][122]
# cod_reducido["sa"][155] = cod_reducido["e7"][122]  # Agregado
cod_reducido["sa"][182] = cod_reducido["e7"][182]
cod_reducido["sa"][186] = {"V": ["V", "A"]}
cod_reducido["sa"][249] = {"V": ["V", "A"]}


def reduced_code(site, pos, aa):
    if ((pos in cod_reducido[site])
        and (aa in cod_reducido[site][pos])):
        return cod_reducido[site][pos][aa]
    return aa


site_pos = {"B2": 85, "B10": 122, "B16": 143, "C6": 154, "CD1": 155, "E4": 179, "E7": 182, "E11": 186,
            "E15": 190, "E17": 192, "E18": 193, "EF1": 194, "EF2": 195, "EF6": 204, "EF8": 206, "F4": 223, "F5": 224,
            "F7": 226, "F8": 227, "FG1": 228, "G5": 244, "G8": 249, "G9": 250, "G11": 252, "G12": 253, "H5": 266,
            "H9": 270, "H12": 274, "H13": 275, "H16": 278}

sites = {"lt": ["B2", "E11", "E15",  "G8", "H5",  "H9"],
         "e7": ["B10", "CD1", "E7", "E11"],
         "g8": ["G8", "G9", "H9" ],
         "sa": ["B10", "CD1", "E7", "E11", "G8"]}
