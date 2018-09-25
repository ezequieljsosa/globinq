from setuptools import setup

with open("README.md") as handle:
    readme_md = handle.read().replace("\n", "")

__version__ = "Undefined"
for line in open('GlobinQ/__init__.py'):
    if (line.startswith('__version__')):
        exec (line.strip())

setup(
    name='globinq',
    packages=['GlobinQ', 'GlobinQ.db'],
    version=__version__,
    #scripts=["GlobinQ/web.py"],
    description=readme_md,
    install_requires=[
        'pandas',
        'biopython',
        'MySQL-python',
        'peewee',
        'bottle',
        'beaker',
        'gevent',
        'tqdm',
        'bson',
        'configparser'
    ],
    author='Ezequiel Sosa - SNDG',
    author_email='ezequieljsosa@gmail.com',
    url='https://github.com/ezequieljsosa/globinq',
    download_url='https://github.com/ezequieljsosa/globinq/archive/' + __version__ + '.tar.gz',
    keywords=['bioinformatics', 'sequence', 'example'],
    classifiers=['Programming Language :: Python', 'Topic :: Scientific/Engineering :: Bio-Informatics',
                 'Intended Audience :: Science/Research', ],
)
