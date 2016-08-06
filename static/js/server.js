var ref_nums=[];
function start_select_server() {
        $("#server_infomation").attr("class","bg_style_list");
        $(".svgserver").css("display","block");
        $(".server_img").css("display","none");
        $(".server_intro").css("display","none");
        $(".server_intro2").css("display","none");
        $(".kaishi_sel").css("display","none");
        $(".start_trail").css("display","block");
        $("ul.server_list").css("display","block");
        $(".start_select_server").css("background","transparent");
        $(".detail_total_len").html(server_lists.length);
        $(".btn_start_use").html(service_btn);
        if(service_btn=="关&nbsp;闭"&&kvs.length!=0){
            $(".btn_start_use").css("color","rgb(255, 255, 255)");
        }
        if($("ul.server_list li").length<2){
            reload_server_list();
        }
}
function reload_server_list() {
    browser_hei=$(window).height();
    if($("#dialog").css("display")!="none"){
        $("#dialog").css({"position":"fixed","bottom":"0px"});
        $(".container").css("height",browser_hei);
        $(".svgrect").css("height",browser_hei);
        $(document).css("scroll","hidden");
        setTimeout(function(){
            var diaTop=$("#dialog").offset().top;
            $('#dialog-info').css("height",diaTop+'px');
        },1000);
    }
    var  div="<li class='borstyle' onclick='select_service(this)'>" +
        "<div class='server_list_lis'>" +
        "<div class='ser_btn_select'>" +
        "<span class='btn_sel btn_select_ser'></span>"+
        "</div>" +
        "<div class='server_pic'>" +
        "<img src='serviceimage'>" +
        "</div>" +
        "<div class='server_infomation'>" +
        "<div class='server_name'><span class='service-name'>servername</span>" +
        "<span class='responseType' style='display: none'>" +
        "<span class='zqjh'><img src='/static/images/s_plan_icon.png' width='67.5' height='20'></span></span></div>" +
        "<div class='server_des'>serverdesc" +
        "<span class='ljxq' onclick='server_detail(serverid,this)'><br>了解详情..</span>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "</li>";
    for (var i=0;i<server_lists.length;i++){
        var serverList=server_lists[i];
        if (serverList.service_type!=0){
            $("ul.server_list").html($("ul.server_list").html()+div.replace('serviceimage',serverList.service_image_url)
                    .replace('servername',serverList.service_name).replace("serverdesc",serverList.service_desc)
                    .replace("serverid",serverList.service_id).replace("none",'inline-block'));
        }
        else{
                $("ul.server_list").html($("ul.server_list").html()+div.replace('serviceimage',serverList.service_image_url)
                    .replace('servername',serverList.service_name).replace("serverdesc",serverList.service_desc)
                    .replace("serverid",serverList.service_id));
        }
    }
    $('.ljxq').bind('click',function(e){
        stopPropagation(e);
    });
    if($(window).width()<375){
        $(".zqjh").each(function (i) {
            $(".zqjh:eq("+i+")").css("display","none");
        })
    }
    browser_hei=$(window).height();
    browser_width=$(window).width();
    var serverWidth=parseInt($("#server_select").css("width"));
    var serverHeight=parseInt($("#server_select").css("height"));
    if(serverWidth>369){
        serverHeight=590.4;
    }
    
    var parentwidth=parseInt($(".server_list_lis").css("width"));
    $("#server_infomation").css({"width":"100%","height":serverHeight-50});
    $(".server_infomation").css({"width":parentwidth-110.59+"px"});
    if(kvs.length!=0){
        for(var k=0;k<kvs.length;k++){
            $(".service-name").each(function (i) {
                if ($(".service-name:eq("+i+")").html()==kvs[k].keyword){
                    $(".service-name:eq("+i+")").parent().parent().parent().parent().find("span.btn_sel").attr("class","btn_sel btn_selected_ser");
                    $(".service-name:eq("+i+")").parent().parent().parent().parent().attr("onclick","");
                    var selectednum=parseInt($(".detail_selected").html());
                    $(".detail_selected").html(selectednum+1);
                    $(".btn_start_use").css("color","rgb(255, 255, 255)");
                }
            })
        }
    }
}

function select_service(li) {
        var kvkeywords='';
        if(kvs.length!=0){
            for(var l=0;l<kvs.length;l++){
                kvkeywords+=kvs[l].keyword;
            }
        }
        if($(li).find("span.btn_sel").attr("class")=="btn_sel btn_select_ser"){
            $(li).find("span.btn_sel").attr("class","btn_sel btn_selected_ser");
            var selectednum=parseInt($(".detail_selected").html());
            $(".detail_selected").html(selectednum+1);
            $(".btn_start_use").css("color","rgb(255, 255, 255)");
            if(kvs.length==0){
                service_btn="开&nbsp;始";
                $(".btn_start_use").html(service_btn);
            }
        }else{
            var selectednum=parseInt($(".detail_selected").html());
            var selectname=$(li).find(".service-name").html();
            $(".detail_selected").html(selectednum-1);

            if(kvkeywords.indexOf(selectname)==-1){
                $(li).find("span.btn_sel").attr("class","btn_sel btn_select_ser");
            }
            if ((selectednum-1)==0){
                $(".btn_start_use").css("color","rgba(255, 255, 255, .0)");
            }
        }
    if(kvs.length!=0){
        if($(".btn_selected_ser").length!=kvs.length){
            service_btn="开&nbsp;始";
            $(".btn_start_use").html(service_btn);
        }else{
            service_btn="关&nbsp;闭";
            $(".btn_start_use").html(service_btn);
        }
    }

}

function server_detail(detail,span) {
    document.getElementById("server_infomation").addEventListener('touchmove', bodyScroll, false);
    $(".ser_detail").css({"display":"block"});
    $("#server_select").css("display","none");
    $("#server_infomation").css("overflow-y",'hidden');
    $("#dialog-info").css("overflow-y",'hidden');
    for (var i=0;i<server_lists.length;i++){
        if(server_lists[i].service_id==detail){
            $(".ser_detail").find(".detail_pic").css({"background":"url("+server_lists[i].service_image_url+")","background-repeat":"no-repeat","background-position":"center bottom","background-size":"200px 200px"});
            $(".ser_detail").find(".detail_desc").html("<div style='font-size: 23px'>"+server_lists[i].service_name+"</div>" +
                "<div class='server_info_detail'>"+server_lists[i].service_detail.replace("使用方法","<br><span style='display:block;margin-top: 10px'></span>使用方法")+"</div>");
            if(server_lists[i].service_type!=0) {
                $(".ser_detail").find("span.response-type").css("display","inline-block");
                $(".ser_detail").find("span.response-type").html($(span).parent().find("span.response-type").html());
            }
        }
    }
}
function bodyScroll(e){
    e.preventDefault();
}
function close_detail(detail) {
    document.getElementById("server_infomation").removeEventListener('touchmove', bodyScroll, false);
    $(detail).parent().css({"display":'none'});
    $("#server_select").css("display","block");
    $("#server_infomation").css("overflow-y",'scroll');
    $("#dialog-info").css("overflow-y",'scroll');
    $(detail).parent().html("<div class='detail_close' onclick='close_detail(this)'></div> <svg class='svgdetail' xmlns='http://www.w3.org/2000/svg'><defs> " +
    "<linearGradient y1='0' x1='0' y2='1' x2='1'  id='svg_4'> " +
    "<stop stop-color='#63636E' offset='0'/> " +
    "<stop stop-color='#9095A2' offset='1'/> </linearGradient> </defs> <g><title>Layer 2</title> <rect id='svg_3' width='100%' height='100%' y='0' x='0' fill='url(#svg_4)'/> </g> </svg> " +
    "<span class='response-type'><img src='/static/images/s_plan_icon.png' width='67.5' height='20' style='display: block'></span> " +
    "<div class='detail_pic'></div> " +
    "<div class='detail_desc'></div>");
}

function start_trail() {
        var colorVal=$(".btn_start_use").css("color");
        $("#dialog-info").css("overflow-y","scroll");
        $("#dialog-input").removeAttr("disabled");
        if(colorVal=="rgb(255, 255, 255)"){
            var kvss=[];
            var names=[];
            var flag=0;
            $(".btn_selected_ser").each(function (i) {
                var kvkeywords='';
                var serviceName=$(".btn_selected_ser:eq("+i+")").parent().parent().find(".service-name").html();
                if(kvs.length!=0){
                    for(var l=0;l<kvs.length;l++){
                        kvkeywords+=kvs[l].keyword;
                    }
                    if(kvkeywords.indexOf(serviceName)==-1){
                        var kv={"key":serviceName,"value":'0',"display_type":0};
                        kvss.push(kv);
                        names.push(serviceName);
                        var kvselect={
                            "property_display_type":0,
                            "refresh_time":transdate(),
                            "parent_node":10000,
                            "keyword":serviceName,
                            "value":0
                        }
                        kvs.push(kvselect);
                        flag++;
                    }
                }else {
                    var kv={"key":serviceName,"value":'0',"display_type":0};
                    kvss.push(kv);
                    names.push(serviceName);
                    var kvselect={
                        "property_display_type":0,
                        "refresh_time":transdate(),
                        "parent_node":10000,
                        "keyword":serviceName,
                        "value":0
                    }
                    kvs.push(kvselect);
                    flag++;
                }
            });
            message={"ref_num":transdate(),'kvs':kvss};
            var ref_num={"ref_num":message.ref_num,"type":"service","kvs":names};
            ref_nums.push(ref_num);
            comObj={"code":802,"subcode":0,"content":message};
            if(flag>0){
                Chat.socket.send(JSON.stringify(comObj));
            }
            if(flag==0){
                $("#server_select_contain").css("display","none");
                if(user_info.is_continue==true){
                    if($("#conv_content p").length==0){
                        query_msg_pack();
                    }
                }
                if(user_info.is_continue==false){
                    reload_index();
                }
            }
        }
}

//    验证邀请码
function proving_code()
{
    if($(".kaishi_sel").css("color")=="rgb(255, 255, 255)"){
        var code=document.getElementById('input_code').value;
        var timestamp=transdate();
        var dicvalue={"date_type":inviteCode,"user_code":code};
        current_ref_num_owner_type=inviteCode;
        showAll_ref();
        add_ref(timestamp,dicvalue);
        message={"ref_num":timestamp,"user_code":code};
        comObj={"code":812,"subcode":0,"content":message};
        Chat.socket.send(JSON.stringify(comObj));
    }

}
function proving_code_coffee() {
    var code=document.getElementById('input_code').value;
    var timestamp=transdate();
    var dicvalue={"date_type":inviteCode,"user_code":code};
    current_ref_num_owner_type=inviteCode;
    showAll_ref();
    add_ref(timestamp,dicvalue);
    message={"ref_num":timestamp,"user_code":code};
    comObj={"code":812,"subcode":0,"content":message};
    Chat.socket.send(JSON.stringify(comObj));
}
function get_user_code() {
    if($(".s_invite_friend").css("color")=="rgb(255, 255, 255)") {
        disable_title();
        $('.screen-shot-prompt').animate({'top':'0'}, 200);
        if (user_owner_code.length== 0) {
            var timestamp = transdate();
            var dicvalue = {"date_type": userCode};
            current_ref_num_owner_type = userCode;
            showAll_ref();
            add_ref(timestamp, dicvalue);
            message = {"ref_num": timestamp};
            comObj = {"code": 811, "subcode": 0, "content": message};
            Chat.socket.send(JSON.stringify(comObj));
        }
        else {
            reload_user_owner_code();
        }
    }
}
var timer_promo;
var promo_code;
var promo_code_value;
function send_promo_code() {
    $(".promo_enter").addClass('promo_focus');
    document.getElementById('promo_input').onkeydown = function(event){
        if (event.keyCode==13) {
            promo_next();
        };
    }
}
function enter_promo_code(){
    if($(".s_entert_promocode").css("color")=="rgb(255, 255, 255)") {
        $("#promo_code").css("display","block");
        $(".promo_container").css("display","block");
        $(".promo_success").css("display","none");
        document.getElementById("promo_input").focus();
        send_promo_code();
        $('.promo_enter').bind('click',function(e){
            stopPropagation(e);
        });
        $("#promo_input").focus(function(){
            send_promo_code();
        });
        $("#promo_input").blur(function(){
            setTimeout(function(){
                $(".promo_enter").removeClass('promo_focus');
            },200)
        });
        $("#promo_input").val("");
        $(".promo_code_error").css("opacity","0");
        promo_code=document.getElementById('promo_input');
        promo_code_value=promo_code.value;
        timer_promo = setInterval(promoCodes, 100);
    }
}

function promoCodes()
{
    if (promo_code_value!==promo_code.value){
        promo_code_value=promo_code.value;
        if(promo_code_value.length<4){
            $(".promo_next").css({"opacity":"0.3"});
            if (promo_code_value.length==0){
                $(".promo_code_error").css("opacity","0");
            }
        }else {
            $(".promo_next").css({"opacity":"1"});
            if(corps=='coffee'){
                $(".promo_next").css({"border-top":" 1px solid rgba(169, 141, 101, .3)"});
            }else{
                $(".promo_next").css({"border-top":" 1px solid rgba(255, 255, 255, .3)"});
            }
        }
    }
}
function promo_next() {
    if ( $(".promo_next").css("opacity")!="0.3"){
        var code=document.getElementById('promo_input').value;
        var timestamp=transdate();
        var dicvalue={"date_type":promoCode,"user_code":code};
        current_ref_num_owner_type=promoCode;
        showAll_ref();
        add_ref(timestamp,dicvalue);
        message={"ref_num":timestamp,"user_code":code};
        comObj={"code":812,"subcode":0,"content":message};
        Chat.socket.send(JSON.stringify(comObj));
    }
}
function close_code() {
    $(".popup_container").css("display",'none');
    clearInterval(timer);
}
