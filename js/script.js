/**
 * Created by Vid on 28.10.14.
 */
Array.prototype.insert = function (index, item) {
  this.splice(index, 0, item);
};

Site = {
    table_body : $("#dataTable tbody"),
    table_head : $("#dataTable thead tr"),

    fields: [],
    order_by: [],
    limit: 50,
    data : [],

    load_data: function(){
        ddt = {
                "fields" : Site.fields? Site.fields.join(","): null,
                "order-by" : Site.order_by? Site.order_by.join(",") : null,
                "limit" : 50,
                "offset" : Site.data.length,
            },
            console.log(ddt);
        $.ajax({
            url: 'http://10.0.0.10:81/get_users',
            method: 'GET',
            data: ddt,
            success: function(info) {
                Site.data_recieved(info)
            }

            })
    },

    data_recieved: function(json_data){
        this.data = this.data.concat(json_data);
        this.append_data_to_table(json_data);
    },

    append_data_to_table: function(new_list){
        $.each(new_list, 
                function(index, single_data){

                    rendered_data = ""
                    for (var i = 0; i < Site.fields.length; i++) {
                        var a = single_data[Site.fields[i]]
                        rendered_data += "<td class='"+ Site.get_value_class(Site.fields[i]) +"'>" + a + "</td>"
                    }
                
                    Site.table_body.append("<tr>"+rendered_data+"</tr>");
                }
              )
    },

    select_fields: function(){
        
        this.reset()

        select = document.getElementsByTagName('select')[0]

        var options = select && select.options;
        
        for(var  i = 0; i < options.length; i++) {
            var opt = options[i];
            if (opt.selected) {
                Site.fields.push(opt.value || opt.text);
            }
        }

        if (Site.fields.indexOf("id")==-1){
            Site.fields.insert(0, "id")
        }
        
        console.log(Site.fields);

        this.table_construct();
        this.load_data();

        var sortTable = document.getElementById("dataTable");
        sorttable.makeSortable(sortTable);
    },

    get_value_class: function(value){

        if (value == "link"){
            return "LinkClass"
        } else if (value == "email"){
            return "EmailClass"
        } else if (value == "locale") {
            return "LocalClass"
        } else if (value == "gender") {
            return "GenderClass"
        } else if (value == "id") {
            return "IdClass"
        } else {
            return "none"
        }
    },

    table_construct: function(){

        var trHead = document.getElementById('tableHead');
        var trFoot = document.getElementById('tableFoot');

        for (var i = 0; i < Site.fields.length; i++) {
            var th = document.createElement('th');
            th.innerHTML = Site.fields[i].charAt(0).toUpperCase() + Site.fields[i].slice(1);
            th.className = "header " + Site.fields[i];
            trHead.appendChild(th);
        }

    },
    reset: function(){
        this.table_body.children().remove();
        this.table_head.children().remove();
        this.fields = [];
        this.order_by = [];
        this.data = [];
    },

    on_scroll_down: function(){
        if($(window).scrollTop() + $(window).height() >= $(document).height()) 
        {
            Site.load_data();
        }
    }
}


$('.sendReq').on('click',function(){
    Site.select_fields()
});

$(window).scroll(function() {
    Site.on_scroll_down();

});




