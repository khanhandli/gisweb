<?php 
    define('PG_DB', "8c4");
    define('PG_HOST', "localhost");
    define('PG_USER', "postgres");
    define('PG_PORT', "5432");
    define('PG_PASS', "postgres");

    #extension = pgsql
    #bat config trong apache php.ini

    $conn = pg_connect("dbname=".PG_DB." password=".PG_PASS." host=".PG_HOST." user=".PG_USER." port=".PG_PORT);
    
    if(!$conn) {
        echo "conectj xit";
    }

    echo "Helo";
    
    //var_dump($conn)
    // $conn = pg_connect("dbname = password= host= port =)

?>