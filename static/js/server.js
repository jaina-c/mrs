var ref_nums=[];
function start_select_server() {
    $("#server_infomation").attr("class","bg_style_list");
    $(".svgserver").css("display","block");
    $(".server_img").css("display","none");
    $(".server_intro").css("display","none");
    $(".kaishi_sel").css("display","none");
    $(".start_trail").css("display","block");
    $("ul.server_list").css("display","block");
    $(".start_select_server").css("background","transparent");
    $(".detail_total_len").html(server_lists.length);
    $(".btn_start_use").html(service_btn);
    if(service_btn=="关&nbsp;闭"){
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
        $(document).scrollTop(0);
        document.body.scrollTop=0;
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
        "<span class='zqjh'><img src='static/images/s_plan_icon.png' width='67.5' height='20'></span></span></div>" +
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
    if($(window).width()<375){
        $(".zqjh").each(function (i) {
            $(".zqjh:eq("+i+")").css("display","none");
        })
    }
    //$("ul.server_list").html($("ul.server_list").html()+"<li class='lastli'>如果你还有其他需求，也可以直接告诉S先生。</li>");
    var parentwidth=parseInt($(".server_list_lis").css("width"));
    $(".server_infomation").css({"width":parentwidth-110+"px"});
    if(kvs.length!=0){
        for(var k=0;k<kvs.length;k++){
            $(".service-name").each(function (i) {
                if ($(".service-name:eq("+i+")").html()==kvs[k].keyword){
                    $(".service-name:eq("+i+")").parent().parent().parent().parent().find("span.btn_sel").attr("class","btn_sel btn_selected_ser");
                    $(".service-name:eq("+i+")").parent().parent().parent().parent().attr("onclick","");
                    console.log($(".service-name:eq("+i+")").parent().parent().parent().parent().attr("onclick"));
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
        }else{
            var selectednum=parseInt($(".detail_selected").html());
            var selectname=$(li).find(".service-name").html();
            $(".detail_selected").html(selectednum-1);
            console.log(kvkeywords);
            console.log(selectname);
            console.log(kvkeywords.indexOf(selectname));
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
    var parentwidth=parseInt($("#server_select").css("width"));
    var parentheight=parseInt($("#server_select").css("height"));
    var parenttop=parseInt($("#server_select").css("top"));
    var parentleft=parseInt($("#server_select").css("left"));
    var det='';
    $(".ser_detail").css({'width':parentwidth,'height':parentheight,"display":"block","position":"absolute","top":parenttop,"left":parentleft,"z-index":100,"border-radius": '4px',"overflow":"hidden"});
    //$(".start_trail").css("display","none");
    //$(".start_select_server").css("border-top","1px solid transparent");
    $("#server_select").css("display","none");
    $("#server_infomation").css("overflow-y",'hidden');
    $("#dialog-info").css("overflow-y",'hidden');
    for (var i=0;i<server_lists.length;i++){
        if(server_lists[i].service_id==detail){
            console.log(JSON.stringify(server_lists[i]));
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
    console.log($(detail).parent().html())
    $(detail).parent().css({"width":"0px","height":"0px","display":'none'});
    $("#server_select").css("display","block");
    $("#server_infomation").css("overflow-y",'scroll');
    $("#dialog-info").css("overflow-y",'scroll');
    $(detail).parent().html("<div class='detail_close' onclick='close_detail(this)'></div> <svg class='svgdetail' xmlns='http://www.w3.org/2000/svg'><defs> " +
    "<linearGradient y1='0' x1='0' y2='1' x2='1'  id='svg_4'> " +
    "<stop stop-color='#63636E' offset='0'/> " +
    "<stop stop-color='#9095A2' offset='1'/> </linearGradient> </defs> <g><title>Layer 2</title> <rect id='svg_3' width='100%' height='100%' y='0' x='0' fill='url(#svg_4)'/> </g> </svg> " +
    "<span class='response-type'><img src='static/images/s_plan_icon.png' width='67.5' height='20' style='display: block'></span> " +
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
            console.log(JSON.stringify(comObj));
            if(flag>0){
                Chat.socket.send(JSON.stringify(comObj));
            }
            if (flag==0){
                $("#server_select_contain").css("display","none");
            }
        }
}
