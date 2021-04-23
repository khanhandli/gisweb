<?php 
    include('../connection/connect.php');
    #restful api. method get, post, delete

    //check bien #_GET co gia tri hay khong

    if(isset($_GET['ten_vung'])){
        $ten_vung = $_GET['ten_vung'];
        //echo ("ten_vung:".$ten_vung);
        //ham strtolower(str) chuyen hoa thang thuong
        $name = strtolower($ten_vung);

        $query = "select *,st_x(ST_Centroid(geom)) as x,st_y(ST_Centroid(geom)) as y from public.camhoangdc where LOWER(txtmemo) like '%$name%'";
        $result = pg_query($conn, $query);
        $tong_so_ket_qua = pg_num_rows($result);

        if($tong_so_ket_qua > 0) {
            while($dong = pg_fetch_array($result, null, PGSQL_ASSOC)) {
                $link = "<a href='javascript:void();' onclick='di_den_diem(".$dong['x'].",".$dong['y'].")'>here</a>";

                print("Hien trang su dung: ".$dong['txtmomo']." | dien tich: ".$dong['shape_area']." ".$link."</br>");
            }
        }else {
            print("Not found");
        }
    }else {
        echo "Not Found";
    }

?>