# GlobinQ 
GlobinQ is a web application to query, upload and analyze different globins.

Authors:

* Bustamante, Juan Pablo
* Martí, Marcelo
* Navarro, Belen  
* Schuster, Claudio
* Sosa, Ezequiel


Related publications
* GlobinQ app-note
* Schuster et al. (not yet published)
* Bustamante 1
* Bustamante 2


## Dev Instalation

### Get the code
```shell script
# Clone the repo or download a release
git clone https://github.com/ezequieljsosa/globinq.git
cd globinq # this will be our working dir !
```
### Config variables
Copy .env_example to .env and update the variables, for example:

```shell script
cp .env_example .env

# inside .env file:
DATABASE_URL=mysql://mysqluser:mysecretpassword@127.0.0.1:3306/globinq
CELERY_BROKER_URL=redis://localhost:6379/0
USE_DOCKER=False
REDIS_URL=rediscache://localhost:6379/1?client_class=django_redis.client.DefaultClient
EMAIL_CONFIG=smtp://user@adomain:smtppass@smtphost:25
```

Check that you will use this configuration in the following steps...

### Software
* Python 3 
* NPM + Webpack
* Docker (needed for the tutorial, but the programs can be installed directly)
  * Mysql
  * Redis

### Install Mysql

```shell script
# Download and start the database
docker run --name=mysql_globinq -p 3306:3306 -d -v $PWD/data/mysql:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=qwerty  mysql:5
# Check if the service is running ok
docker logs mysql_globinq
# open sql shell
docker exec -it mysql_globinq mysql -uroot -p 
```
Sometimes works if you just put a blank password, even if the MYSQL_ROOT_PASSWORD has a different value
```sql
-- Update Password 
ALTER USER 'root'@'%' IDENTIFIED BY 'somepass';
-- Create database
CREATE DATABASE globinq;
```

### Install Frontend Libraries

```shell script
curl https://raw.githubusercontent.com/creationix/nvm/v0.25.0/install.sh | bash
source $HOME/.bashrc
nvm install 8.9.4  
nvm use v8.9.4
npm install
# Fix compatibility issues
cp ./node_modules/msa/css/msa.css  ./node_modules/msa/css/msa.css.bk 
grep -v '//FIX' ./node_modules/msa/css/msa.css.bk > ./node_modules/msa/css/msa.css 
# Prepare frontend bundle
./node_modules/.bin/webpack

```

### Load tables

```shell script
# load the schema
./manage.py migrate

# load taxonomy
cd data/generated
wget https://ftp.ncbi.nlm.nih.gov/pub/taxonomy/taxdump.tar.gz
tar xfvz taxdump.tar.gz


# blast PDB
cd data/generated
wget ftp://ftp.wwpdb.org/pub/pdb/derived_data/pdb_seqres.txt
makeblastdb -dbtype prot -in pdb_seqres.txt
blastp -evalue 1e-6 -qcov_hsp_perc 90 -outfmt 6 \
  -db pdb_seqres.txt -query sequences.fasta | awk '$3 > 90' > blast_pdb.tbl 

# load the truncated globins data
./manage.py load_data --pdbs_path /Users/esosa/data/pdb/divided

# load M and S Family

```

### Create Index
### Abundance Files
### PDB updates
### Run the App
```shell script
# Run webapp
# Run celery
```


## Production Install

### Environment Variables
Configure .env_example environment variables 

### Software

* Mysql
* Python 3
* Nginx + Gunicorn
* GlobinQ Relase X 

### Data

#### Copy Files

#### Import database

### Server Config


http://stackoverflow.com/questions/14381898/local-dependency-in-package-json
https://ourcodeworld.com/articles/read/528/how-to-use-components-of-bootstrap-3-in-reactjs

Create config
* copy globinq.config.templ to globinq.config
* change globinq.config with your configuration

Load from scratch
* python setup.py develop
* mysql  --execute="create database globinq;"
* Load ncbi taxonomy
  * sudo apt install libmysqlclient-dev 
  * sudo cpan -i DBI DBD::mysql
  * wget https://raw.github.com/biosql/biosql/master/sql/biosqldb-mysql.sql
  * wget https://raw.github.com/biosql/biosql/master/scripts/load_ncbi_taxonomy.pl
  * chmod +x load_ncbi_taxonomy.pl
  * mysql  --execute="create database bioseqdb;"
  * mysql -u root -p bioseqdb < biosqldb-mysql.sql
  * ./load_ncbi_taxonomy.pl --dbname bioseqdb --driver mysql --dbuser root --dbpass yourpass --download true
* Load globins taxonomy
  * ```bash
       python GlobinQ/db/load_tax.py
    ```
  
* Load globins manually curated data
```bash

   blastp -db /data/databases/pdb/processed/seqs_from_pdb.fasta -query \
      ./data/generated/sequences.fasta -outfmt 5 -evalue 0.01 \
     -qcov_hsp_perc 80       -max_hsps 1 >  data/generated/blast_pdb.xml
     
   blastp -db /data/databases/pdb/processed/seqs_from_pdb.fasta -query \
           ./data/generated/sequences.fasta -outfmt 6 -evalue 0.01 \
          -qcov_hsp_perc 80       -max_hsps 1 >  data/generated/blast_pdb.tbl
   
   python GlobinQ/db/load_data.py
```
* Calculate abundances
```bash
python GlobinQ/db/abundances.py
```
* Update cristalized globins   
```bash
  python GlobinQ/db/update_pdb_alignments.py 
```
* Copy generated files to public dir
  cp data/tree_data.json public/generated
  cp data/msa.fasta public/generated
  cp data/abundances* public/generated
  
* Load tree


* Web
  * curl https://raw.githubusercontent.com/creationix/nvm/v0.25.0/install.sh | bash
  * nvm install 8.9.4  
  * nvm use v8.9.4
  * cd sbgglmol
  * npm install  
  * ./node_modules/webpack/bin/webpack.js
  * cd ..
  * npm install
  * npm start

* Deploy
  * DB (from dump)
    * create globinq
    * download globinq.sql
    * mysql globinq < globinq.sql
  * Server
      * copy GlobinQ code
      * create a .wsgi file in apache dir
      * change db user/pass in web.py
      * restart apache
      * test api
  * Client
    * in source directory execute "npm run-script build" 
    * copy "build" directory to /var/www/html/globinq (change build directory name)
     
  * Apache config
    * /etc/apache2/sites-enabled/globinq.conf
    ```
    <VirtualHost *:80> 
    	ServerAdmin webmaster@localhost
    	DocumentRoot /var/www/html/globinq/
    	ServerName globinq
    	ServerAlias globinq.qb.fcen.uba.ar
    	
    	ErrorLog ${APACHE_LOG_DIR}/error.log
    	CustomLog ${APACHE_LOG_DIR}/access.log combined       	
    
        WSGIDaemonProcess globinq_api threads=5
        WSGIScriptAlias /globinq_api /var/www/html/globinq_api/app.wsgi
        <Directory "/var/www/html/globinq_api">
               WSGIProcessGroup globinq_api
               WSGIApplicationGroup %{GLOBAL}
               Order deny,allow
               Allow from all
    
        </Directory>
    
        <Directory "/var/www/html/globinq">
            RewriteEngine on    
            RewriteBase /
            RewriteCond %{REQUEST_FILENAME} !-f
            RewriteCond %{REQUEST_FILENAME} !-d
            RewriteCond %{REQUEST_FILENAME} !-l
            RewriteRule ^.*$ / [L,QSA]
        </Directory>
    
    </VirtualHost>
    ```
  
