var Chat = {},
    packageHandler={},
    conv_list=[],
    userName='',
    user_info={},
    Console = {},
    Dialog={},
    prologs0=[],prologs1=[],prologs2=[],prologs3=[],
    current_start_weight=0,
    save_address=[],
    total_trail_time=0,
    expire_time='',
    current_trail_time=0,
    current_status= 0,
    flag=0;
var qscroll='';
var current_query=[];
var request_flag=0;
var user_avatar='';
var isSelected=0;
var nowTimeStamp=0;
var expireTimeStamp=0;
var server_lists=[];
var kvs=[];
var service_btn='';
Chat.initialize = function() {
    if (window.location.protocol == 'http:') {
        // Chat.connect('ws://' + window.location.host + ':8100/im');
        Chat.connect('ws://www.essential.com.cn:8100/im');
    } else {
        // Chat.connect('wss://' + window.location.host + ':8100/im');
        Chat.connect('wss://http://www.essential.com.cn:8100/im');
    }
};
Chat.socket = null;
Chat.connect = (function(host) {
    if ('WebSocket' in window) {
        Chat.socket = new WebSocket(host);
    } else if ('MozWebSocket' in window) {
        Chat.socket = new MozWebSocket(host);
    } else {
        Console.log('Error: WebSocket is not supported by this browser.');
        return;
    }

    Chat.socket.onopen = function () {
        Console.log('Info: WebSocket connection opened.');
        $("#dialog-input").removeAttr("disabled");
        $("#dialog-input").css("opacity",'1');
        $(".pack_menu").css("opacity","1");
        if($(".socketClose")){
            $(".socketClose").remove();
        }
        logingObj={"open_id":open_id};
        Chat.socket.send(JSON.stringify(logingObj));
        document.getElementById('dialog-input').onkeydown = function(event){
            if (event.keyCode==13) {
                if (event.altKey) {
                    Chat.dialogAddLine();
                    return;
                };
                flag=0;
                Chat.sendMessage();
            };
        }
    };

    Chat.socket.onclose = function () {
        Console.log('Info: WebSocket closed.');
        msg= '<div class="cs-msg socketClose">' +
            '<div class="cs_avatars"><div class="avatar"></div></div><span class="cs_bubble"></span>' +
            '<span class="cs-msg-content">Hey, user_name. 你已经和S先生断开连接，请点击<span onclick="login()" style="color: #3C9FFD;cursor:pointer">重新登陆</span>继续。</span></span></div>';
        var consoles = document.getElementById('conv_content');
        Dialog.log(msg.replace("user_name",userName));
        // $(".pack_menu").css("opacity","0.8");
        $("#dialog-info").stop().animate({scrollTop: consoles.scrollHeight}, '0');
        $(".change").css("display","none");
        $("#changeDialog").html("");
        $("#changeDialog").css("display","none");
        $("#dialog-input").attr("disabled","disabled");
        $("#dialog-input").css("opacity",'0.3');
        $(".testEdit").css("display",'none');
        $(".pack_menu").css("display",'none');
        $(".rest_days").css("display","none");
        $("#server_select_contain").css("display","none");
        // $("#dialog").css("display","block");

    };

    Chat.socket.onmessage = function (message) {
        console.log(message.data);
        packageHandler.process(message.data);
    };
});
Console.log = (function(message) {
    //var console = document.getElementById('control');
    //var p = document.createElement('p');
    //p.style.wordWrap = 'break-word';
    //p.innerHTML = message;
    //console.appendChild(p);
    //console.scrollTop = console.scrollHeight;

    /**while (console.childNodes.length > 25) {
                console.removeChild(console.firstChild);
            }*/
    console.log(message);
});

Chat.sendMessage = (function() {
    var message = $('#dialog-input').val();
    //console.log(message)
    if(message!=''){
        content={"msg":message,"ref_num":transdate()};
        comObj={"code":501,"subcode":0,"content":content};
        //console.log(JSON.stringify(comObj));
        Chat.socket.send(JSON.stringify(comObj));
        setTimeout(clearInput,10);
        msg='<div class="user-msg" id="refnum">' +
        '<span class="user-msg-content" >' +
        message+
        '</span>' +
        //'<span class="bubble"></span>' +
        '<span class="user-avatar"><span class="bubble"></span><img src=" '+user_avatar+'"></span>' +
        '</div>';
        inputChange();
        Dialog.log(msg.replace("refnum",content.ref_num));
        var msgcon={"timestamp":content.ref_num,"record_text":content.msg,"cs_id":0};
        if(JSON.stringify(conv_list)=="[]"){
            conv_list.push(msgcon);
        }

    }
});
function inputChange(){
    $("#changeDialog").css("display","none");
    $("#changeDialog").html("");
    $("#dialog").css("display",'block');
    if($(".change").text()==""){
        $(".change").css("display","none");
    }
    if($(".change").text()!=""&&$(".change").css("display")=="block"){
        message= '<div class="cs-msg" id="'+transdate()+'">' +
        '<div class="cs_avatars"><div class="avatar"></div></div><span class="cs_bubble"></span>' +
            '<span class="cs-msg-content">'+$(".changeHuashu").text()+ '</span>';
        '</div>';
        Dialog.log(message)
    }
    $(".change").css("display","none");
    $(".weather").css("display","none");
    $(".click_me").css("display","none");

}
Chat.dialogAddLine =(function(){
    var dialog_content=$("#dialog-input").val();
    dialog_content=dialog_content+"\n";
    $("#dialog-input").val(dialog_content);
});
function clearInput() {
    $("#dialog-input").val("");
}
packageHandler.process=(function(msg){
    try {
        var msgObj=JSON.parse(msg);
    }
    catch (e) {
        /** not msgObj */
        return;
    }
    if (msgObj.code==100&&msgObj.subcode==0) {
        console.log(JSON.stringify(msgObj));
        user_info=msgObj.content.user_info;
        prologs=msgObj.content.prologs;
        server_lists=msgObj.content.services;
        kvs=msgObj.content.kv;
        var kvLength=msgObj.content.kv.length;
        if(kvLength==0){
            isSelected=0;
        }else{
            isSelected=1;
        }
        for(var i=0;i<prologs.length;i++){
            var type=prologs[i].type;
            if(type==0){//未激活，未试用
                prologs0.push(prologs[i]);
            }
            if(type==1){//已激活
                prologs1.push(prologs[i]);
            }
            if(type==2){//试用中
                prologs2.push(prologs[i]);
            }
            if(type==3){//试用完
                prologs3.push(prologs[i]);
            }
        }
        reload_mrs_page(user_info);
    };
    if(msgObj.code==10){
        //console.log(msgObj)
        for(var i=0;i<ref_nums.length;i++){
            if (msgObj.content.ref_num==ref_nums[i].ref_num){
                if(ref_nums[i].type=="service"){
                    if (msgObj.content.retMsg=="SUCCESS"){
                        $("#server_select_contain").css("display","none");
                        $(".testEdit").css("display",'none');
                        $(".pack_menu").css("display",'none');
                        var browser_hei=$(window).height();
                        var inputhei=parseInt($("#dialog").css("height"));
                        $("#dialog-info").css({"height":(browser_hei-inputhei)+"px","padding-left":"15px","padding-right":"15px"});
                        $(".scrollWrap").css({"height":(browser_hei-inputhei-50)+"px"});
                        var detailNames='';
                        for (var k=0;k<ref_nums[i].kvs.length;k++){
                            if (k<(ref_nums[i].kvs.length-1)){
                                detailNames=detailNames+ref_nums[i].kvs[k]+"、"
                            }
                          else {
                                detailNames=detailNames+ref_nums[i].kvs[k]
                            }
                        }
                        var msges='<div class="user-msg" id="refnum">' +
                            '<span class="user-msg-content" >我需要' +
                            detailNames+
                            '</span>' +
                            '<span class="user-avatar"><span class="bubble"></span><img src=" '+user_avatar+'"></span>' +
                            '</div>';
                        $("#changeDialog").css("display","none");
                        $("#changeDialog").html("");
                        $("#dialog").css("display",'block');
                        if($(".change").text()==""){
                            $(".change").css("display","none");
                        }
                        $(".change").css("display","none");
                        $(".weather").css("display","none");
                        $(".click_me").css("display","none");
                        content={"msg":"我需要"+detailNames,"ref_num":transdate()};
                        comObj={"code":501,"subcode":0,"content":content};
                        Chat.socket.send(JSON.stringify(comObj));
                        Dialog.log(msges.replace("refnum",ref_nums[i].ref_num));
                        $(".rest_days").css("display","none");
                        var msgcon={"timestamp":content.ref_num,"record_text":content.msg,"cs_id":0};
                        if(JSON.stringify(conv_list)=="[]"){
                            conv_list.push(msgcon);
                        }
                    }
                }
            }
        }
    }
    if (msgObj.code==301) {
        if(conv_list.length==1){
            $('#conv_content').html("");
        }else{};
        current_query=msgObj.content.ref_reply;
        conv_list=conv_list.concat(msgObj.content.ref_reply);
        if(conv_list[0].record_text==conv_list[1].record_text){
            conv_list.splice(0,1)
        }
        reload_conv_list(conv_list);
        inputChange();
    };
    if(msgObj.code==101){
        $(".change").css("display","none");
        $("#changeDialog").html("");
        $("#changeDialog").css("display","none");
        $("#dialog").css("display",'block');
        
        if(msgObj.content.is_recv==1){
            message=
                '<div class="cs-msg" id="'+(msgObj.content.timestamp*1000)+'">' +
                '<div class="cs_avatars"><div class="avatar"></div></div><span class="cs_bubble"></span>' +
                '<span class="cs-msg-content">' + msgObj.content.msg + '</span>';
            '</div>';
        }
        else{
            message='<div class="user-msg">' +
            '<span class="user-msg-content">' +
            msgObj.content.msg +
            '</span>' +
            '</div>';
        }
        Dialog.log(message);
    }
});
// 获取某个时间格式的时间戳
function datetostamp(dates){
    var stringTime = dates;
    var timestamp2 = Date.parse(new Date(stringTime.replace("-","/").replace("-","/")));
    timestamp2 = timestamp2 / 1000;
    //2014-07-10 10:21:12的时间戳为：1404958872
    console.log(stringTime + "的时间戳为：" + timestamp2);
    return timestamp2
}

function reload_mrs_page(user_info){
    userName=user_info.user_name;
    expire_time=user_info.expire_time;
    user_avatar=user_info.avatar;
    current_status=user_info.user_status;
    if(current_status==0){
        service_btn="开始试用";
    }else{
        service_btn="开始使用";
    }
    nowTimeStamp=parseInt(transdate()/1000);
    //user_info.is_continue=false;
    if(expire_time!=null){
        expireTimeStamp=datetostamp(expire_time);
    }else{
        expireTimeStamp=0;
    }
    if (expireTimeStamp==0){$(".days_num").html("00")}
    else {

        if (nowTimeStamp<expireTimeStamp){
            var restDays=expireTimeStamp-nowTimeStamp;
            var day_num=parseInt(restDays/60/60/24);
            if(parseInt(day_num/10)<1){
                $(".days_num").html("0"+day_num);
            }else{
                $(".days_num").html(day_num);
            }
        }else{
            if(user_info.is_continue==true){
                query_msg_pack();
            }
            if(user_info.is_continue==false){
                reload_index();
            }
            $(".days_num").html("00");
        }
    }
    if(current_status==0){
        if(expire_time!=null){
            if (expireTimeStamp>nowTimeStamp){
                if(isSelected==0){
                    $("#server_select_contain").css("display","block");
                    $(".testEdit").css("display",'block');
                    $(".rest_days").css("display","none");
                }else {
                    if(user_info.is_continue==true){
                        query_msg_pack();
                    }
                    if(user_info.is_continue==false){
                        reload_index();
                    }
                }
            }
        }
        else{
            if(isSelected==0){
                $("#server_select_contain").css("display","block");
                $(".testEdit").css("display",'block');
                $(".rest_days").css("display","none");
            }else {
                if(user_info.is_continue==true){
                    query_msg_pack();
                }
                if(user_info.is_continue==false){
                    reload_index();
                }
            }
        }
    }else if(current_status==1){
        if(expire_time==null){
            if(isSelected==0){
                $("#server_select_contain").css("display","block");
                $(".testEdit").css("display",'block');
                $(".rest_days").css("display","none");
            }else {
                if(user_info.is_continue==true){
                    query_msg_pack();
                }
                if(user_info.is_continue==false){
                    reload_index();
                }
            }
        }else {
            if(expireTimeStamp>nowTimeStamp){
                if(isSelected==0){
                    $("#server_select_contain").css("display","block");
                    $(".testEdit").css("display",'block');
                    $(".rest_days").css("display","none");
                }else {
                    if(user_info.is_continue==true){
                        query_msg_pack();
                    }
                    if(user_info.is_continue==false){
                        reload_index();
                    }
                }
            }else {
                if(user_info.is_continue==true){
                    query_msg_pack();
                }
                if(user_info.is_continue==false){
                    reload_index();
                }
            }
        }
    }
}
Chat.initialize();
function sendMessage(){
    document.getElementById('dialog-input').onkeydown = function(event){
        if (event.keyCode==13) {
            if (event.altKey) {
                Chat.dialogAddLine();
                return;
            };
            send_index_con();
        };
    }
}
function send_index_con() {
    if($(".dialog-input").val()!=""){
        setTimeout(function () {
            flag=0;
            var browser_hei=$(window).height();
            var inputhei=parseInt($("#dialog").css("height"));
            $("#dialog-info").css({"height":(browser_hei-inputhei)+"px","padding-left":"15px","padding-right":"15px"});
            $("#container").css("height",browser_hei);
            $(".scrollWrap").css({"height":(browser_hei-inputhei-50)+"px"});
            $(".testEdit").css("display","none");
            $(".rest_days").css("display","none");
            $(".pack_menu").css("display",'none');
            $(".symbol").css("display","inline-block");
            $("#container").scrollTop(0);
            $("#container").css("overflow-y","hidden");
            Chat.sendMessage();
        },1000)
    }

}

function reload_index(){
    var browser_hei=$(window).height();
    $(".container").css("height",browser_hei);
    //$(".container").css("overflow",'hidden');
    $("#dialog-info").css("height",browser_hei);
    //$(".change").css("display","block");
    if($("#dialog").css("display")=="none"){
        $(".change").css("display","block");
        $("#changeDialog").css("display","block");
        $(".testEdit").css("display","block");
        $(".pack_menu").css("display",'block');
        if(current_status==0){
            $(".rest_days").css("display","block");
        }
    }
    if($("#dialog").css("display")=="block"){
        $(".change").css("display","none");
        $(".changeDialog").css("display","none");
        var diaTop=$("#dialog").offset().top;
        $('#dialog-info').css("height",diaTop+'px');
    }
    $(".changeHuashu").css("display","block");
    reload_prologs();
    if( $(".change").css("display")=="block"){
        var marginUp=(parseInt(browser_hei)-(parseInt($(".scrollWrap").css("height"))))/2;
        var aa=browser_hei*0.09;
        $(".change").css("margin-top",(marginUp-aa)+"px");
    }
    if($("#dialog").css("display")=="block"){
        $("#dialog").css("display","block");
    };
}

var random_num=[];
function ran_num(n,m){
    var c = m-n+1;
    var number=Math.floor(Math.random() * c + n);
    if(random_num.length==0){random_num.push(number)}
    while(number==random_num[random_num.length-1]){
        number=Math.floor(Math.random() * c + n)
    }
    random_num.push(number);
    return number;
    //console.log(random_num)
}
function startWeight(pro,s){
    var num=0;
    for(var i=0;i<pro.length;i++){
        if(s==0){
            num+=pro[i].start_weight
        }
        if(s==1){
            num+=pro[i].change_weight
        }
    }
    return num;
}
var  current_prolog=[];
function show_prologs(pro){
    current_prolog=pro;
    if(corps=="enjoy"){
        $(".changeHuashu").html("<span>"+pro[current_start_weight].prolog_0.replace("user_name",userName).replace("residue_times",total_trail_time-current_trail_time).replace("S先生","Enjoy")+"<span></span><div></div>");
        $("#changeDialog").html("<div class='symbol'></div>" +
        "<div class='input_index'>" +
            "<form class='dialogForm' action='#' onsubmit='return false' style='width: 100%'>" +
            "<input type='text' style='width: 98%;' placeholder='"+pro[current_start_weight].prolog_1.replace("S先生","Enjoy")+"' id='dialog-input' class='dialog-input' title='send' >" +
            "<span class='index_send_message'>发送</span>" +
            "</form>" +
            "</div><div class='dosometihing'><span class='click_me' id='click_me' onclick='change_prologs()'>换一个</span></div>" );
    }
    if(corps==undefined){
        $(".changeHuashu").html("<span>"+pro[current_start_weight].prolog_0.replace("user_name",userName).replace("residue_times",total_trail_time-current_trail_time)+"<span></span><div></div>");
        $("#changeDialog").html("<div class='symbol'></div>" +
            "<div class='input_index'><form class='dialogForm' action='#' onsubmit='return false' style='width: 100%'>" +
            "<input type='text' placeholder='"+pro[current_start_weight].prolog_1+"' id='dialog-input' class='dialog-input' title='send' >" +
            "<span class='index_send_message' onclick='send_index_con()'>发&nbsp;送</span> " +
            "</form>"+
            "</div><div class='dosometihing'><span class='click_me' id='click_me' onclick='change_prologs()'>换一个</span></div>" );
        $("input.dialog-input").css("width",parseInt($(".dialogForm").css("width"))-45+"px");
    }
    var ua = navigator.userAgent.toLowerCase();
    $("#dialog-input").focus(function(){
        browser_hei=$(window).height();
        $(".symbol").css("display","none");
        $("#click_me").css("display","none");
        $(".dialog-input").attr("placeholder",'');
        $("span.index_send_message").css("display","inline-block");
        if(ua.indexOf("iphone")>0||ua.indexOf("android")>0){
            (function (browser_hei) {
                setTimeout(function(){
                    var dialogth=$("#changeDialog").offset().top- $(document).scrollTop();
                    if(window.innerHeight==browser_hei){
                        $("#container").css("overflow-y","scroll");
                        $("#dialog-info").css("height",browser_hei+500);
                        $("#container").scrollTop(browser_hei*0.3);
                    }
                    else if(window.innerHeight!=browser_hei){
                        if((parseInt(dialogth)>parseInt(window.innerHeight))==true){
                            $("#container").css("overflow-y","scroll");
                            $("#dialog-info").css("height",browser_hei+500);
                            $("#container").scrollTop(window.innerHeight);
                        }
                        else{

                        }
                    }
                    else{

                    }
                },1000)
            })(browser_hei);
        }
    });
    $("#dialog-input").blur(function(){
        if($(".dialog-input").val()==""){
            $("span.index_send_message").css("display","none");
        }
        $("#click_me").css("display","inline");
        $(".symbol").css("display","inline-block");
        $(".dialog-input").attr("placeholder",pro[current_start_weight].prolog_1);
        $("#dialog-info").css("height",browser_hei);
        $("#container").scrollTop(0);
        $("#container").css("overflow-y","hidden");
    });
    sendMessage();
}
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var minute=date.getMinutes();
    var seconds=date.getSeconds();
    var hour= date.getHours();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    if (minute >= 0 && minute <= 9) {
        minute = "0" + minute;
    }
    if (seconds >= 0 && seconds <= 9) {
        seconds = "0" +seconds ;
    }
    if (hour >= 0 && hour <= 9) {
        hour = "0" +hour ;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + hour + seperator2 + minute
        + seperator2 + seconds;
    var datecurr={
        "year":date.getFullYear(),
        "month":month,
        "date":strDate,
        "hour":hour,
        "minute":minute,
        "seconds":seconds
    }
    return JSON.stringify(datecurr);
}

function reload_prologs(){
        if($(".change").css("display")=="block"){
            if(current_status==0){
                if(expireTimeStamp>nowTimeStamp||expireTimeStamp==nowTimeStamp){//试用中
                    if($(".changeHuashu").length==1){
                        current_start_weight=random_weight(prologs2,0);
                        show_prologs(prologs2);
                    };
                }
                else if(expireTimeStamp<nowTimeStamp){//试用完
                    if($(".changeHuashu").length==1){
                        current_start_weight=random_weight(prologs3,0);
                        show_prologs(prologs3);
                    };
                }
                else if(expireTimeStamp==0){//未开始试用
                    //console.log(JSON.stringify(prologs0));
                    if($(".changeHuashu").length==1){
                        current_start_weight=random_weight(prologs0,0);
                        show_prologs(prologs0);
                    };
                }
            }
            if(current_status==1){//已激活
                if($(".changeHuashu").length==1){
                    current_start_weight=random_weight(prologs1,0);
                    show_prologs(prologs1)
                };
            }
        }

        //$(".weather").css("display","block");
    ///*地理位置*/
    getLocation();
}

function getLocation()
{
    if (navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(showPosition,showError);
    }
    else{x.innerHTML="Geolocation is not supported by this browser.";}
}

function showPosition(position)
{
    lnglatXY = [position.coords.longitude,position.coords.latitude];
    regeocoder();
}

function showError(error)
{
    switch(error.code)
    {
        case error.PERMISSION_DENIED:
            x.innerHTML="用户拒绝对获取地理位置的请求。";
            break;
        case error.POSITION_UNAVAILABLE:
            x.innerHTML="位置信息是不可用的。";
            break;
        case error.TIMEOUT:
            x.innerHTML="请求用户地理位置超时。";
            break;
        case error.UNKNOWN_ERROR:
            x.innerHTML="未知错误。";
            break;
    }
}

function regeocoder() {  //逆地理编码
    var geocoder = new AMap.Geocoder({
        radius: 500
    });
    geocoder.getAddress(lnglatXY, function(status, result) {
        if (status === 'complete' && result.info === 'OK') {
            geocoder_CallBack(result);
        }
    });
}
function geocoder_CallBack(data) {
    addr = data.regeocode.formattedAddress; //返回地址描述
    province=data.regeocode.addressComponent.province;
    // alert(addr)
    update_address_pack(addr);
    //$("#result").html(province);
    //    getWeather(province);
}
var prologs_num=[];
function random_weight(prologs,s){//随机权重数
    var m=startWeight(prologs,s);
    var rd=ran_num(0,m);
    var prolog_weight=0;
    var current_weight=0;
        for(var i=0;i<prologs.length;i++){
            if(s==0){prolog_weight+=prologs[i].start_weight;}
            if(s==1){prolog_weight+=prologs[i].change_weight;}
            if(rd>prolog_weight||rd==prolog_weight){
                current_weight=i;
            }
        }
    //console.log("随机数"+rd);
    //console.log("下角标"+current_weight);
   if(prologs_num.length==0){
       prologs_num.push(current_weight);
       return current_weight;
   }
    if(prologs_num.length!=0){
        if(prologs.length>1){
            while(prologs_num[(prologs_num.length-1)]==current_weight){
                var rd=ran_num(0,m);
                var prolog_weight=0;
                var current_weight=0;
                for(var i=0;i<prologs.length;i++){
                    if(s==0){prolog_weight+=prologs[i].start_weight;}
                    if(s==1){prolog_weight+=prologs[i].change_weight;}
                    if(rd>prolog_weight||rd==prolog_weight){
                        current_weight=i;
                    }
                }
                //console.log("123:"+current_weight);
                if(current_weight!=prologs_num[(prologs_num.length-1)]){
                    prologs_num.push(current_weight);
                    prologs_num.splice(0,1);
                    //console.log(prologs_num);
                    return current_weight;
                }
            }
        }

            prologs_num.push(current_weight);
            prologs_num.splice(0,1);
            //console.log(prologs_num);
            return current_weight;
    }


}
function change_prologs(){
    current_start_weight=random_weight(current_prolog,1);
    show_prologs(current_prolog);
}
function reload_conv_list(conv_list){
    console.log(JSON.stringify(conv_list))

    var browser_hei=$(window).height();
    $(".container").css("height",browser_hei);
    $(".container").css("overflow",'hidden');
    $(".change").css("display","none");
    $(".changeDialog").css("display","none");
    var inputhei=parseInt($("#dialog").css("height"));
    $("#dialog-info").css({"height":(browser_hei-inputhei)+"px","padding-left":"15px","padding-right":"15px"});
    var consoles = document.getElementById('conv_content');
    var consolesHei=consoles.scrollHeight;
    if($("#conv_content p").length==0){
        for(var i=conv_list.length-1;i>-1;i--){
            if(conv_list[i].cs_id==0){
                msg='<div class="user-msg" id="'+conv_list[i].timestamp+'">' +
                '<span class="user-msg-content">' +
                conv_list[i].record_text +
                '</span>' +
                '<span class="user-avatar"><span class="bubble"></span><img src=" '+user_avatar+'"></span>' +
                '</div>';
            }
            else{
                msg= '<div class="cs-msg" id="'+conv_list[i].timestamp+'">' +
                '<div class="cs_avatars"><div class="avatar"></div></div><span class="cs_bubble"></span>' +
                '<span class="cs-msg-content">' + conv_list[i].record_text + '</span>';
                '</div>';
            }
            Dialog.log(msg);
            $("#dialog").css("display",'block');

        }
        if(flag==0){
            $("#dialog-info").stop().animate({scrollTop: consoles.scrollHeight}, '0');
        }
        getLocation();
    }
    else if($("#conv_content p").length>0){
        if(JSON.stringify(current_query)!="[]"){
            for(var i=0;i<current_query.length;i++){
                if(current_query[i].cs_id==0){
                    msg='<div class="user-msg" id="'+current_query[i].timestamp+'">' +
                    '<span class="user-msg-content">' +
                    current_query[i].record_text +
                    '</span>' +
                    //'<span class="bubble"></span>' +
                    '<span class="user-avatar"><span class="bubble"></span><img src=" '+user_avatar+'"></span>' +
                    '</div>';
                }
                else{
                    msg= '<div class="cs-msg" id="'+current_query[i].timestamp+'">' +
                    '<div class="cs_avatars"><div class="avatar"></div></div><span class="cs_bubble"></span>' +
                    '<span class="cs-msg-content">' + current_query[i].record_text + '</span>';
                    '</div>';
                }
                var consoles = $('#conv_content');
                var p = document.createElement('p');
                p.style.wordWrap = 'break-word';
                p.innerHTML = msg;
                consoles.prepend(p);
                var preword=$("#conv_content p:first-child div:first-child").attr("class");
                var pretime=$("#conv_content p:first-child div:first-child").attr("id");
                var currentword=$("#conv_content p:nth-child(2) div:first-child").attr("class");
                var currenttime=$("#conv_content p:nth-child(2) div:first-child").attr("id");
                var cha=parseInt(currenttime/1000)-parseInt(pretime/1000);
                var shicha=JSON.parse(timestamp(cha));
                if(preword==currentword){
                    $("#conv_content p:nth-child(2)").css("margin-top","25px");
                }
                if(preword!=currentword){
                    $("#conv_content p:nth-child(2)").css("margin-top","35px");
                }
                if(pretime!=undefined&&currenttime!=undefined){
                    if(shicha.mintue>3||shicha.day!=0||shicha.hour!=0){
                        $('#conv_content  p:nth-child(2)').before('<p class="shijian">'+format(parseInt(currenttime/1000))+'</p>');
                    }
                }
            }
            var newHeight=document.getElementById('conv_content').scrollHeight;
            (function(nh,ch){
                var adjust_height=parseInt( nh-ch-10);
                //Console.log("adjust is"+adjust_height);
                $("#dialog-info").css("overflow-y","hidden");
                $("#dialog-info").scrollTop(adjust_height);
                $("#dialog-info").css("overflow-y","auto")
            })(newHeight,consolesHei);
            //Console.log("old_height："+consolesHei)
            //Console.log("new_height:"+newHeight)
            //Console.log("scrolltop:"+ $("#dialog-info").scrollTop())
            current_query=[];
            request_flag=0;

        }

    }
    $(".loader").css("display","none");
    console.log(request_flag);
}
Dialog.log=(function(message){
    var consoles = document.getElementById('conv_content');
    var p = document.createElement('p');
    p.style.wordWrap = 'break-word';
    p.innerHTML = message;
    var preword=$("#conv_content p:last-child div:first-child").attr("class");
    var pretime=$("#conv_content p:last-child div:first-child").attr("id");
    consoles.appendChild(p);
    //console.log(consoles.innerHTML);
    var currentword=$("#conv_content p:last-child div:first-child").attr("class");
    var currenttime=$("#conv_content p:last-child div:first-child").attr("id");
    var cha=parseInt(currenttime/1000)-parseInt(pretime/1000);
    var shicha=JSON.parse(timestamp(cha));
    //console.log("pre:"+format(parseInt(pretime/1000)));
    //console.log("curr:"+format(parseInt(currenttime/1000)));
    if(preword==currentword){
        $("#conv_content p:last-child").css("margin-top","25px");
    }
    if(preword!=currentword){
        $("#conv_content p:last-child").css("margin-top","35px");
    }
    if(qscroll==''){
        qscroll = new qScroll(refesh);
    }
    if(pretime!=undefined&&currenttime!=undefined){
        //console.log(shicha)
        if(shicha.mintue>3||shicha.day!=0||shicha.hour!=0){
            $('#conv_content  p:last-child').before('<p class="shijian">'+format(parseInt(currenttime/1000))+'</p>');
        }
    }
    console.log(flag);
    if(flag==0){
        $("#dialog-info").stop().animate({scrollTop: consoles.scrollHeight}, '0');
        //document.getElementById('dialog-info').scrollTop = consoles.scrollHeight;
    }
});
function timestamp(nTime){
    //var oDate1 = new Date(2015,8,1,15,30,0);
    //var oDate2 = new Date(2015,10,1,0,0,0);
    //var nTime = Math.abs((oDate2.getTime() - oDate1.getTime()))/1000;
    var day = Math.floor(nTime/86400);
    var hour = Math.floor(nTime%86400/3600);
    var minute = Math.floor(nTime%86400%3600/60);
    var shicha={'day':day,"hour":hour,"mintue":minute};
    return JSON.stringify(shicha)
}
function add0(m){return m<10?'0'+m:m }
function format(shijianchuo)
{
//shijianchuo是整数，否则要parseInt转换
    var currentdate=JSON.parse(getNowFormatDate());
    var times=''
    var time = new Date(shijianchuo*1000);
    var y = time.getFullYear();
    var m = time.getMonth()+1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    if(y!=currentdate.year){
        times=y+'年'+add0(m)+'月'+add0(d)+'日'+' '+add0(h)+':'+add0(mm)
    }
    if(y==currentdate.year&&m==currentdate.month){
        if(d==currentdate.date){
            times=add0(h)+':'+add0(mm)
        }
        if(d==(currentdate.date-1)){
            times="昨天 "+add0(h)+':'+add0(mm)
        }
        if(d==(currentdate.date-2)){
            times="前天 "+add0(h)+':'+add0(mm);
        }
        if(d<currentdate.date-2){
            times=add0(m)+'月'+add0(d)+'日'+' '+add0(h)+':'+add0(mm)
        }
    }
    return times
}
function transdate(){
   return Math.round(new Date().getTime());
}//时间转化为时间戳

function query_msg_pack(){
    var timestamp;
    if(JSON.stringify(conv_list)=="[]"){
        timestamp=transdate();
    }else{
       timestamp=conv_list[conv_list.length-1].timestamp;
    }
    if(flag==0){
        message={"timestamp":timestamp,"count":40,"ref_num":transdate()};
    }
    if(flag!=0){
        message={"timestamp":timestamp,"count":15,"ref_num":transdate()};
        request_flag++;
    }
    comObj={"code":701,"subcode":0,"content":message};
    console.log(JSON.stringify(comObj))
    Chat.socket.send(JSON.stringify(comObj));

}
function update_address_pack(addr){
    message={"address":addr,"ref_num":transdate()};
    comObj={"code":801,"subcode":0,"content":message};
    if(addr!=''){
        Chat.socket.send(JSON.stringify(comObj));
        // alert(JSON.stringify(comObj));
        save_address.push(message.ref_num);
    }
    else{
        return comObj;
    }
}
function palpitation(){
    var message='##Client##Alive##';
    Chat.socket.send(message);
    setTimeout("palpitation()", 3000);
}

setTimeout("palpitation()",3000);

 
function login(){
    flag=0;
    Chat.initialize();
}
function refesh(){
    query_msg_pack();
}
function menuList(){
    document.getElementById("menu_list").innerHTML="";
    var div=document.createElement("div");
    div.className='menuDiv';
    div.innerHTML="<img src='static/images/s_qr.png' width='135px' height='135px' style='display: block'>" +
        "<div style='width: 135px;color:rgba(255,255,255,.6);text-align: center;font-size: 12px;position: absolute;line-height: 27px;'>长按二维码识别</div>";
    document.getElementById("menu_list").appendChild(div);
    $("#dialog-info").click(function () {
        document.getElementById("menu_list").innerHTML=""
    })
}
function close_bottom_title(icon){
    setTimeout(function(){
        $(icon).parent().css("display","none");
        var diaTop=$("#dialog").offset().top;
        $('#dialog-info').css("height",diaTop+'px');
    },700);
}
function server_list() {
    if( $(".pack_menu").css("opacity")!=0.8){
        $("#server_select_contain").css("display","block");
        $(".block").css("display","none");
        $("#dialog-input").attr("disabled","disabled");
        $("#dialog-info").css("overflow-y","hidden");
        service_btn="关&nbsp;闭";
        start_select_server();
    }
}
function select_server() {
    $(".pack_menu_list").css({"display":"block"});
    $(".pack_menu_list li").click(function () {
        $(".pack_menu_list").css({"display":"none"});
    })
}