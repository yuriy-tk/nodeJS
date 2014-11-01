var http = require('http');
var mysql = require('mysql');
var url = require('url');

var db_config = {
    host : "localhost",
    user : "root" ,
    database: "db"
};


function get_connection(){
   return mysql.createConnection(db_config)
}

http.createServer(function (req, res) {



    a = url.parse(req.url, true);


    switch (a.pathname){
        case "/get_users":
            Users.get_users(a.query, res);
            break;
        case "/":
            Users.get_users(a.query, res);
            break;
       
        default :
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end('Hello World\n');


    }
}).listen(81, '0.0.0.0');

console.log('Server running at http://0.0.0.0:81/');

Users = {

    table_name : "users_user",

    get_users : function (get_data, res){
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");

        var fields = "";
        var order_by = "`id`";
        var offset = "";
        var limit = 50;

        console.log("Get_uswers");

        if (get_data.hasOwnProperty("fields") && get_data.fields != ""){
            fields = this.template_val_for_sql(get_data.fields.split(","))
        }
        else
        {
            fields = "*"
        }

        if (get_data.hasOwnProperty("order_by") && get_data.order_by != ""){
             order_by = this.template_val_for_sql(get_data.order_by.split(","))
        }

        if (get_data.hasOwnProperty("offset") && get_data.offset != ""){
             offset = "OFFSET "+ get_data.offset;
        }

        if (get_data.hasOwnProperty("limit") && get_data.limit != ""){
             limit = get_data.limit;
        }


        var query = "SELECT " + fields + " FROM `" + this.table_name + "` ORDER BY " + order_by + " ASC LIMIT " + limit + " " + offset;

        console.log(query);

        var connection = get_connection();
        connection.query(query, function(err, rows, fields){

            console.log("row count : " + rows.length);

            if (err == null){
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify(rows));
            }else{
                res.writeHead(500, {'Content-Type': 'text/html'});
                res.end(err.toString());
            }
        });
        connection.end();

},
    template_val_for_sql: function(val_list){
        template = "";
        for (var i = 0; i<val_list.length; i++){
            if (i != val_list.length-1){
                template += "`"+val_list[i]+'`, '
            }else{
                template += "`"+val_list[i]+'`'
            }
        }
        return template;
    }
};


