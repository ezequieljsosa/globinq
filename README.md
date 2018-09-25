http://stackoverflow.com/questions/14381898/local-dependency-in-package-json

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
  