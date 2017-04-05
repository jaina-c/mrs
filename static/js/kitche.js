var serverURL="http://zeus.mints.cc/"
$(document).ready(function(){
    var bars=document.getElementById("bar").value;
    tableList(bars);
    tableShow();
    var date = new Date();
    this.year = date.getFullYear();
    this.month = date.getMonth() + 1;
    this.date = date.getDate();
    if(this.month<10){
        datess=this.year+"-"+0+this.month
    }
    if(this.month>9){
        datess=this.year+"-"+this.month
    }
    var year=this.year;
    var month=this.month;
    var date=this.date;


    $.ajax({
        url: serverURL+"openmarket/loadedit.html",
        data:{date:datess,flag:"noadd"},
        dataType: "json",
        type: "post",
        success: function (data) {
            console.log(JSON.stringify(data));
            if(date<10){
                dateyes=datess+"-0"+(date-1);
                datess=datess+"-0"+(date);
            }
            if(date>9){
                dateyes=datess+"-"+(date-1);
                datess=datess+"-" +(date);
            }
            $(".todaydate").text("["+datess+"的订单]")

            $(".yesterdaydate").text("["+dateyes+"的订单]")
            //alert(datess)
            $.each(data.data,function(d){
                if(datess==data.data[d].date){
                    //alert(data.data[d].endTime)
                    $("#date").html(datess);
                    KitCheList();
                }
            })
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            //alert("receiveList" + XMLHttpRequest.status);
            //alert("receiveList" + XMLHttpRequest.readyState);
            //alert("receiveList" + textStatus);
        }
    })

    //if(this.month<10){
    //    $("#date").html(this.year+"-0"+this.month+"-"+this.date+" "+"18:30");
    //}else if(this.month>9){
    //    $("#date").html(this.year+"-"+this.month+"-"+this.date+" "+"18:30");
    //}

});
function out(){
    $.ajax({
        url: serverURL+"logout.html",
        dataType: "json",
        type: "post",
        success: function (data) {
            alert(data.msg)
            if(data.msg=="退出成功！"){
                window.location=serverURL+"web/login.html";
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            //alert("outlogin" + XMLHttpRequest.status);
            //alert("outlogin" + XMLHttpRequest.readyState);
            //alert("outlogin" + textStatus);
        }
    })
}
function KitCheList(){
    var barin=$("#bar").val();
    var pagein=$("#page").val();
    clearTableBody();
    iniKitCheList(pagein,barin)

}//end:获取收货时间信息列表
function iniKitCheList(pagein,barin){
    var date=$("#date").html()
    $.ajax({
        url: serverURL+"statistic/cookroom.html",
        data:{page:pagein,size:barin,datetime:date},
        dataType: "json",
        type: "post",
        success: function (data) {
            //alert(JSON.stringify(data))
            var  tablebody=document.getElementById("tableBody");
            $("#bars").text(data.totalCount);
            $("#pages").text(data.totalPage);
            var otable=document.getElementById("theadtr");
            var reforeNode=document.getElementById("dishName");
            for(var a=0;a<data.summary.intervalCount.length;a++){
                var th=document.createElement("th");
                th.innerHTML="收货时间<span class='interval'>"+data.summary.intervalCount[a].interval+"</span>的份数";
                otable.insertBefore(th,reforeNode);
            }
            var bars=document.getElementById("bar").value;
            tableList(bars)
            for(var t=0;t<tablebody.rows.length;t++){
                tablebody.rows[t].cells[0].innerText=data.data[t].dishId.substr(1);
                tablebody.rows[t].cells[1].innerText=data.data[t].dishId;
                tablebody.rows[t].cells[2].innerText=data.data[t].dishName;
                for(var i=0;i<document.getElementsByClassName("interval").length;i++){
                    for(var val=0;val<data.data[t].intervalCount.length;val++){
                        if(data.data[t].intervalCount[val].interval==document.getElementsByClassName("interval")[i].innerText){
                            tablebody.rows[t].cells[i+3].innerText=data.data[t].intervalCount[val].count;
                        }
                    }
                }
                tablebody.rows[t].cells[tablebody.rows[t].cells.length-1].innerText=data.data[t].totalCount;
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            //alert("kitchelist" + XMLHttpRequest.status);
            //alert("kitchelist" + XMLHttpRequest.readyState);
            //alert("kitchelist" + textStatus);
        }
    })
}
function tableShow(){
    var barin=$("#bar");
    var pagein=$("#page");

    //页数初始数量为1，并失效减
    $("#minpage").attr('disabled',true);
    //条数增加
    $("#add").click(function(){

        var bars=$("#bars").text();
        var pages=$("#pages").text();
        if(bars==barin.val()){
            $("#add").attr('disabled',false);
            alert("共"+bars+"条");
        }else{
            barin.val(parseInt(barin.val())+1);
            $('#min').attr('disabled',false);
            tableList(barin.val())
            clearTableBody();
            iniKitCheList(pagein.val(),barin.val());
        }
    })
    //条数减少
    $("#min").click(function(){
        if (parseInt(barin.val())==1){
            $('#min').attr('disabled',true);
        }else{
            $('#min').attr('disabled',false);
            barin.val(parseInt(barin.val())-1);
            tableList(barin.val())
            clearTableBody()
            iniKitCheList(pagein.val(),barin.val());
        }
    })
    //页数增加
    $("#addpage").click(function(){
        var bars=$("#bars").text();
        var pages=$("#pages").text();
        if(pages==pagein.val()){
            $("#addpage").attr('disabled',false);
            alert("共"+pages+"页");
        }else{
            pagein.val(parseInt(pagein.val())+1);
            if (parseInt(pagein.val())!=1){
                $('#minpage').attr('disabled',false);
                clearTableBody()
                iniKitCheList(pagein.val(),barin.val());
            }
        }
    })
    //页数减少
    $("#minpage").click(function(){
        if (parseInt(pagein.val())==1){
            $('#minpage').attr('disabled',true);
        }else{
            $('#minpage').attr('disabled',false);
            pagein.val(parseInt(pagein.val())-1);
            clearTableBody()
            iniKitCheList(pagein.val(),barin.val());
        }
    })
}//页数