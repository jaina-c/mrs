var accountHistory=[];
var currenthistory=[];
var currentorderhistory=[];
var orderHistory=[];
var userInfo;
var timer_promo;
var promo_code;
var promo_code_value;
var localHost=window.location.host;
var accoutPages=1,orderpage=1;
var touchManager;
$(document).ready(function(){
    // get_user_info();
    // authorize_debug();
    scrollBottomTest();
    reload_account_change()
    touchManager = {
        "_startX": void 0,
        "_startY": void 0,
        "touchstart": (function(_this) {
            return function(event) {
                _this._startX = event.touches[0].pageX;
                return _this._startY = event.touches[0].pageY;
            };
        })(this),
        "touchmove": (function(_this) {
            return function(event) {
                var moveX, moveY;
                moveX = Math.abs(_this._startX - event.touches[0].pageX);
                moveY = event.touches[0].pageY - _this._startY;
                if(moveY>0){
                    if ($("#act-content").scrollTop()==0) {
                        return event.preventDefault();
                    }
                }else{
                    var viewH =$("#act-content").height(),//可见高度
                         contentH =$("#act-content").get(0).scrollHeight,//内容高度
                         scrollTop =$("#act-content").scrollTop();//滚动高度
                    if((contentH - viewH - scrollTop)==0){
                        return event.preventDefault();
                    }
                }

            };
        })(this)
    };
    document.getElementById('act-content').addEventListener('touchstart', touchManager.touchstart);
    document.getElementById('act-content').addEventListener('touchmove', touchManager.touchmove);
});
var scrollBottomTest =function(){
    $("#act-content").scroll(function(){
        var $this =$(this),
            viewH =$(this).height(),//可见高度
            contentH =$(this).get(0).scrollHeight,//内容高度
            scrollTop =$(this).scrollTop();//滚动高度
        //if(contentH - viewH - scrollTop <= 100) { //到达底部100px时,加载新内容
        if(scrollTop/(contentH -viewH)==1){ //到达底部100px时,加载新内容
            // 这里加载数据..
            // console.log(currenthistory.length);
            var acclass=$(".balance-change").attr('class');
            var orderclass=$(".purchase-history").attr('class');
            if (acclass.indexOf('click')!=-1){
                if (currenthistory.length>30||currentorderhistory.length==30){
                    accoutPages++;
                    get_acount_history(1);
                }
            }
            if (orderclass.indexOf('click')!=-1){
                if (currentorderhistory.length>30||currentorderhistory.length==30){
                    orderpage++;
                    
                    get_order_history(1);
                }
            }
        }
    });
}

function authorize_debug() {
    var xhrurl = 'http://www.essential.com.cn/api/authorize_debug';
    $.ajax({
        url: xhrurl,
        dataType: "json",
        type: "get",
        success: function (data) {
          console.log(data);
            if(data.result=='success'){
                get_user_info();
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest);
            console.log(errorThrown);
            console.log(textStatus);
        }
    })
}

function authorize() {
    var xhrurl = 'http://'+localHost+'/api/authorize';
    $.ajax({
        url: xhrurl,
        dataType: "json",
        type: "get",
        success: function (data) {
            var redirect_uri=data.redirect_uri;
            var uriarr=redirect_uri.split('#');
            uriarr[0]=uriarr[0]+'&state='+window.location.href;
            redirect_uri=uriarr[0]+'#'+uriarr[1];
            window.location=redirect_uri;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest);
            console.log(errorThrown);
            console.log(textStatus);
        }
    })
}

function close_rechange() {
    $(".act-popup-container").css("display",'none');
    clearInterval(timer_promo);
}
function recharge_next() {
    var price=parseFloat($("#recharge-input").val());
    if (isNaN(price)==false&&price>0.01||price==0.01){
        price=price*100;
        // var url='http://'+localHost+'/api_s/transfer?amt='+price;
        var url='http://www.essential.com.cn/api_s/transfer?amt='+price;
        $.ajax({
            url: url,
            dataType: "json",
            type: "get",
            success: function (data) {
               console.log(JSON.stringify(data));
                WeixinJSBridge.invoke('getBrandWCPayRequest',data.prepay_content, function(res){
                    if(res.err_msg == "get_brand_wcpay_request:ok"){
                        location.pathname = '/'
                    }
                });
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log(XMLHttpRequest);
                console.log(errorThrown);
                console.log(textStatus);
            }
        })

        // window.location.href="http://"+localHost+"/wxAuthCallback/wxpay_transfer?amt="+price;
    }else{
        alert('充值金额必须为大于0.01');
    }
}
function get_acount_history(num) {
    $(".balance-change").addClass('balance-change-click');
    $(".purchase-history").removeClass('purchase-history-click');
    if (num==0){
        if (accountHistory.length==0){
            get_account_change();
        }else{
            reload_account_change();
        }
    }
    if(num==1){
        get_account_change();
    }
}
function get_account_change() {
    // var url='http://'+localHost+'/api_s/account_history';
    var url='http://www.essential.com.cn/api_s/account_history?page='+accoutPages;
    $.ajax({
        url: url,
        dataType: "json",
        type: "get",
        success: function (data) {
            var transfers=data.transfers;
            for(var i=0;i<transfers.length;i++){
                var trans=transfers[i];
                trans.order_name='充值';
                trans.order_price=trans.amount;
                trans.is_order=false;
                trans.order_id=trans.transfer_trade_no;
                trans.order_status=trans.transfer_status;
            }
            var t_orders=data.orders;
            for(var i=0;i<t_orders.length;i++){
                var orders=t_orders[i];
                orders.finish_time=orders.pay_time;
                orders.is_order=true;
            }
            var achange=transfers.concat(t_orders);
            accountHistory=accountHistory.concat(achange);
            currenthistory=achange;
            console.log(JSON.stringify(accountHistory));
           reload_account_change();
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest);
            console.log(errorThrown);
            console.log(textStatus);
        }
    })
}
function reload_account_change(){
    accountHistory.sort(function (a, b) {return Date.parse(a.finish_time.replace('-','/').replace('-','/')) - Date.parse(b.finish_time.replace('-','/').replace('-','/'));});
   accountHistory=[
       {"manipulate_cs":null,"order_telephone":"0","refund_records":[],"order_id":146374452654961,"pay_method":0,"auto_order_argument":"user_id:1021","session_id":null,"order_info":null,"order_name":"YEAR_FEE","create_time":"2016-05-20 19:42:06","order_price":2,"pay_time":"2016-06-20 15:18:05","paid_user":1021,"auto_order_type":1,"order_status":2,"order_json":"0","order_address":"","finish_time":"2016-06-20 15:18:05"},{"manipulate_cs":null,"order_telephone":"0","refund_records":[],"order_id":146364084239488,"pay_method":0,"auto_order_argument":"user_id:1021","session_id":null,"order_info":null,"order_name":"YEAR_FEE","create_time":"2016-05-19 14:54:02","order_price":2,"pay_time":"2016-05-19 14:54:11","paid_user":1021,"auto_order_type":1,"order_status":2,"order_json":"0","order_address":"","finish_time":"2016-05-19 14:54:11"},{"manipulate_cs":null,"order_telephone":"0","refund_records":[],"order_id":146346647780090,"pay_method":0,"auto_order_argument":"user_id:1021","session_id":null,"order_info":null,"order_name":"YEAR_FEE","create_time":"2016-05-17 14:27:57","order_price":2,"pay_time":"2016-05-17 14:28:05","paid_user":1021,"auto_order_type":1,"order_status":2,"order_json":"0","order_address":"","finish_time":"2016-05-17 14:28:05"},{"manipulate_cs":null,"order_telephone":"0","refund_records":[],"order_id":146346599262544,"pay_method":0,"auto_order_argument":"user_id:1021","session_id":null,"order_info":null,"order_name":"YEAR_FEE","create_time":"2016-05-17 14:19:52","order_price":2,"pay_time":"2016-05-17 14:22:19","paid_user":1021,"auto_order_type":1,"order_status":2,"order_json":"0","order_address":"","finish_time":"2016-05-17 14:22:19"},{"manipulate_cs":null,"order_telephone":"0","refund_records":[],"order_id":146346557567725,"pay_method":0,"auto_order_argument":"user_id:1021","session_id":null,"order_info":null,"order_name":"YEAR_FEE","create_time":"2016-05-17 14:12:55","order_price":2,"pay_time":"2016-05-17 14:19:47","paid_user":1021,"auto_order_type":1,"order_status":2,"order_json":"0","order_address":"","finish_time":"2016-05-17 14:19:47"},{"manipulate_cs":null,"order_telephone":"0","refund_records":[],"order_id":146346529528599,"pay_method":0,"auto_order_argument":"user_id:1021","session_id":null,"order_info":null,"order_name":"YEAR_FEE","create_time":"2016-05-17 14:08:15","order_price":2,"pay_time":"2016-05-17 14:12:36","paid_user":1021,"auto_order_type":1,"order_status":2,"order_json":"0","order_address":"","finish_time":"2016-05-17 14:12:36"},{"manipulate_cs":null,"order_telephone":"0","refund_records":[],"order_id":146346512104102,"pay_method":0,"auto_order_argument":"user_id:1021","session_id":null,"order_info":null,"order_name":"YEAR_FEE","create_time":"2016-05-17 14:05:21","order_price":2,"pay_time":"2016-05-17 14:05:30","paid_user":1021,"auto_order_type":1,"order_status":2,"order_json":"0","order_address":"","finish_time":"2016-05-17 14:05:30"},{"manipulate_cs":null,"order_telephone":"23123","refund_records":[],"order_id":146302476482263,"pay_method":2,"auto_order_argument":null,"session_id":null,"order_info":"","order_name":"测试添加paid user 功能 ","create_time":"2016-05-12 11:46:04","order_price":1,"pay_time":"2016-05-12 11:51:00","paid_user":1021,"auto_order_type":null,"order_status":2,"order_json":"[{\"amount\": \"1\", \"price\": \"1\", \"commodity\": \"1\"}]","order_address":"123123123","finish_time":null},{"manipulate_cs":null,"order_telephone":"0","refund_records":[],"order_id":146302158761137,"pay_method":0,"auto_order_argument":"user_id:1021","session_id":null,"order_info":null,"order_name":"YEAR_FEE","create_time":"2016-05-12 10:53:07","order_price":2,"pay_time":"2016-05-12 11:44:47","paid_user":1021,"auto_order_type":1,"order_status":2,"order_json":"0","order_address":"","finish_time":"2016-05-12 11:44:47"},{"manipulate_cs":null,"order_telephone":"12345678901","refund_records":[{"order_id":145657623466656,"amount":1,"refund_status":0,"refund_content":"reasoning it","refund_id":10014}],"order_id":145657623466656,"pay_method":1,"auto_order_argument":null,"session_id":10178,"order_info":"","order_name":"重复的unifyorder test","create_time":"2016-02-27 20:30:34","order_price":1,"pay_time":"2016-03-02 18:00:58","paid_user":1021,"auto_order_type":null,"order_status":2,"order_json":"[{\"amount\": \"\", \"price\": \"\", \"commodity\": \"\"}]","order_address":"","finish_time":null},{"manipulate_cs":null,"order_telephone":"155-7277-0000","refund_records":[],"order_id":145673575034947,"pay_method":1,"auto_order_argument":null,"session_id":10001,"order_info":"","order_name":"订单1","create_time":"2016-02-29 16:49:10","order_price":1,"pay_time":"2016-03-02 15:19:42","paid_user":1021,"auto_order_type":null,"order_status":2,"order_json":"[{\"amount\": \"22\", \"price\": \"1\", \"commodity\": \"11111\"}]","order_address":"","finish_time":null}]

    console.log(accountHistory)
    $(".act-acount-month").html('');
    if (accountHistory.length!=0){
        // $(".act-acount-history").css({'margin-top':'2.65vh','border-top':'1px solid rgba(216, 216, 216, 0.3)'});
        $(".act-acount-history").css({ 'margin-top':''});
        var yearm=[];
        $.each(accountHistory,function (i) {
            var pay_time=accountHistory[i].pay_time;
            var pay_timearr=pay_time.split(' ')[0].split('-');
            var ym=[pay_timearr[0],pay_timearr[1]];
            var flag=0;
            $.each(yearm,function (i) {
                if(ym[0]==yearm[i][0] && ym[1]==yearm[i][1]){
                    flag++
                }
            });
            if (flag==0){
                yearm.push(ym);
            }
        });
        for (var j=(yearm.length-1);j>=0;j--){
            var li='<li class="act-acount-month-li"><div class="act-history-month">'+yearm[j][0]+'年'+yearm[j][1]+'月</div>' +
                '<ul class="act-history-detail"></ul></li>';
            $(".act-acount-month").append(li);
            for (var k=(accountHistory.length-1);k>=0;k--){
                var pay_time=accountHistory[k].pay_time;
                var pay_timearr=pay_time.split(' ')[0].split('-');
                var date=pay_time.split(' ')[1];
                if (pay_timearr[0]==yearm[j][0]&&pay_timearr[1]==yearm[j][1]){
                    var li='<li class="act-history-detail-li" onclick="look_acount_history_detial('+accountHistory[k].order_id+')">' +
                        '<div class="act-name-date">' +
                        '<div class="act-nameanddate"><div class="act-history-name">ordername</div>' +
                        '<div class="act-history-date">'+pay_timearr[1]+'月'+pay_timearr[2]+'日'+'&nbsp;'+date+'<span class="act-refund">&nbsp;refundacount</span></div>' +
                        '</div>' +
                        '</div>' +
                        '<div class="act-history-price">orderprices</div></li>';
                    var refundmoney=0;
                    if(accountHistory[k].refund_records!=undefined){
                        if(accountHistory[k].refund_records.length!=0){
                            for(var r=0;r<accountHistory[k].refund_records.length;r++){
                                refundmoney+=accountHistory[k].refund_records[r].amount;
                            }
                            if (refundmoney/100==(accountHistory[k].order_price/100)){
                                li=li.replace('refundacount','已全额退款');
                            }else{
                                li=li.replace('refundacount','已退款¥'+refundmoney/100);
                            }
                            li=li.replace('refundacount','已退款¥'+refundmoney/100);
                        }else{
                            li=li.replace('refundacount',' ');
                        }
                    }else{
                        li=li.replace('refundacount',' ');
                    }
                    // if(achange[k].auto_order_type==1){
                    //     li=li.replace('ordername','购买会员');
                    // }else{
                    //     li=li.replace('ordername',achange[k].order_name)
                    // }
                    if(accountHistory[k].is_order==false){
                        li=li.replace('ordername','充值').replace('orderprices','<span class="plus"></span><span class="minus-prices">¥'+accountHistory[k].order_price/100+'</span>');
                    }else{
                        li=li.replace('ordername',accountHistory[k].order_name).replace('orderprices','<span class="minus"></span><span class="minus-prices">¥'+accountHistory[k].order_price/100+'</span>');

                    }
                    $(".act-acount-month-li:eq("+ ($(".act-acount-month-li").length-1)+") .act-history-detail").append(li);
                }
            }
        }
        $(".act-acount-month").append('<li class="act-history-month-last"></li>');
    }else{
        var li='<li class="act-no-history">暂无余额变动</li>';
        $(".act-acount-month").append(li);
        $(".act-acount-history").css({ 'margin-top':'5.9vh'})
    }
}
function look_acount_history_detial(orderid) {
    $('.act-content').css({display:'none'});
    $('.history-detail').animate({height:"100%",'overflow':'auto'},200);
    $(".act-history-pay-detail").css('display','block');
    var li=' <li class="act-detail-name"><div class="detail-left">商品</div><div class="detail-right">ordername</div></li> ' +
        '<li class="act-detail-title"><div class="detail-left">支付方式</div><div class="detail-right">paymethod</div></li> ' +
        '<li class="act-detail-title "><div class="detail-left">当前状态</div><div class="detail-right" id="current-order-status">orderstatus</div></li> ' +
        '<li class="act-detail-title"><div class="detail-left">支付时间</div><div class="detail-right">paytime</div></li> ' +
        '<li class="act-detail-title"><div class="detail-left">交易单号</div><div class="detail-right">orderid</div></li>';
    $(".act-hisory-detail-ul").html(li);
    $.each(accountHistory,function (i) {
        var history=accountHistory[i];
        if(history.order_id==orderid){
            var cash=''+history.order_price/100+'';
            $(".act-pay-price-money").html('¥&nbsp;'+cash);
            var ht=$(".history-detail").html();
            var ordername='';
            var paymethod=history.pay_method;
            var orderstatus=history.order_status;
            if(history.auto_order_type==1){
                ordername='购买会员';
            }
            if(history.is_order==false){
                ordername='充值';
                if(orderstatus==1){
                    orderstatus='支付成功'
                }
                if(orderstatus==0){
                    orderstatus='未支付';
                }
                paymethod='微信支付';
            }else
            {
                ordername=history.order_name
            }
            if(paymethod==0){
                paymethod='未支付';
            }
            else if(paymethod==1){
                paymethod='余额支付';
            }else if(paymethod==2){
                paymethod='微信支付';
            }
            if (history.refund_records!=undefined){
                if(history.refund_records.length==0){
                    if(orderstatus==2){
                        orderstatus='支付成功'
                    }
                    if(orderstatus==1){
                        orderstatus='未支付';
                    }
                }else{
                    var refundmoney=0;
                    for(var r=0;r<history.refund_records.length;r++){
                        refundmoney+=history.refund_records[r].amount;
                    }
                    if(refundmoney/100==history.order_price/100){
                        orderstatus='已全额退款';
                    }else{
                        orderstatus='已退款 ¥'+refundmoney/100;
                    }
                }
            }
            $(".history-detail").html(ht.replace('ordername',ordername).
            replace('paymethod',paymethod).replace('orderstatus',orderstatus).replace('paytime',history.finish_time).replace('orderid',history.order_id));
            if (history.refund_records!=undefined) {
                if (orderstatus.indexOf('退款') != -1) {
                    $("#current-order-status").css({'color': '#D23232'});
                }
            }
        }
    })
}
function close_detail_act() {
    $('.history-detail').animate({height:"0px",'overflow':'hidden'},200);
    $(".act-history-pay-detail").css('display','none');
    $('.act-content').css({display:'block'});
}

function get_user_info() {
    // var url='http://'+localHost+'/api_s/account';
    var url='http://www.essential.com.cn/api_s/account';
    $.ajax({
        url: url,
        dataType: "json",
        type: "get",
        success: function (data) {
            console.log(JSON.stringify(data))
            
            if(data.expire_time==undefined){
                authorize();
            }else {
                userInfo=data;
                alert(userInfo.year_fee_count)
                if (userInfo.year_fee_count==null){
                    $(".act-recharge-btn").css({background:'rgba(90,97,108,.2)',color:'rgba(255,255,255,.3)'});
                }
                var expire_time=data.expire_time;
                var expire_stamp=datetostamp(expire_time);
                var rest_day=expire_stamp-transdate();
                var daynum=parseInt(rest_day/1000/60/60/24);
                if (rest_day<0){daynum='00';}
                $(".days_num").html(daynum);
                var cash=''+data.cash_amount/100+'';
                $(".act-cash-amount").html('<span class="cash-amount"><span class="money-icon">¥</span>'+cuter(cash)+'</span>');
                get_acount_history(1);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest);
            console.log(errorThrown);
            console.log(textStatus);
        }
    })
}
function cuter(str){//Rekey
    var strs='';
    if (str.indexOf('.')!=-1){
        strs=str.split('.')[0]
    }else{
        strs=str;
    }
    var len = strs.length, str2 = '',
        max = Math.floor(len / 3);
    if(len>3){
        for(var i = 0 ; i < max ; i++){
            var s = strs.slice(len - 3, len);
            strs = strs.substr(0, len - 3);
            str2 = (',' + s) + str2;
            len = strs.length;
        }
        strs += str2;
    }
    if (str.indexOf('.')!=-1){
        strs=strs+'.'+str.split('.')[1]
    }
    return strs
}
function datetostamp(dates){
    var stringTime = dates;
    var timestamp2 = Date.parse(new Date(stringTime.replace("-","/").replace("-","/")));
//        timestamp2 = timestamp2 / 1000;
    //2014-07-10 10:21:12的时间戳为：1404958872
    return timestamp2
}
function transdate(){
    var tramp=Math.round(new Date().getTime());
    return tramp;
}//时间转化为时间戳
function go_to_buy_member(){
    window.location.href="http://"+localHost+"/year_fee";
}
function recharge() {
    if(userInfo.year_fee_count>0){
        $("#recharge").css("display","block");
        $(".act-popup-container").css("display","block");
        document.getElementById("recharge-input").focus();
        account_recharge();
        $("#recharge-input").focus(function(){
            account_recharge();
        });
        $("#recharge-input").blur(function(){
            setTimeout(function(){
                $(".act-promo-enter").css({"top":"","margin-top":""});
            },200)
        });
        $("#recharge-input").val("");
        promo_code=document.getElementById('recharge-input');
        promo_code_value=promo_code.value;
        timer_promo = setInterval(promoCodes, 100);
    }else {
        $(".act-recharge-btn").css({background:'rgba(90,97,108,.2)',color:'rgba(255,255,255,.3)'});
    }

}
function promoCodes()
{
    if (promo_code_value!==promo_code.value){
        promo_code_value=promo_code.value;
        if(promo_code_value.length<1){
            $(".recharge_next").css({"color":"rgba(255,255,255,.3)"});
        }else {
            $(".recharge_next").css({"color":"rgba(255,255,255,1.0)"})
        }
    }
}
function account_recharge() {
    var prowid=parseInt($(".act-promo-enter").css("width"));
    $(".act-promo-enter").css({"top":"0px","margin-top":"6vh",'margin-left':-1*prowid/2});
    document.getElementById('recharge-input').onkeydown = function(event){
        if (event.keyCode==13) {
            recharge_next();
        };
    }
}
function get_order_change() {
// var url='http://'+localHost+'/api_s/order_history?page='+orderpage;
    var url='http://www.essential.com.cn/api_s/order_history?page='+orderpage;
    $.ajax({
        url: url,
        dataType: "json",
        type: "get",
        success: function (data) {
            orderHistory=orderHistory.concat(data);
            currentorderhistory=data;
            orderHistory.sort(function (a, b) {return Date.parse(b.pay_time) - Date.parse(a.pay_time);});
            console.log(JSON.stringify(orderHistory));
            if (orderHistory.length!=0) {
               
                reload_order_change();
            }else{
                $(".act-acount-month").html('');
            var li='<li class="act-no-history">暂无消费记录</li>';
                $(".act-acount-month").append(li);
                $(".act-acount-history").css({ 'margin-top':'5.9vh'})
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest);
            console.log(errorThrown);
            console.log(textStatus);
        }
    })
}
function get_order_history(num) {
    $(".purchase-history").addClass('purchase-history-click');
    $(".balance-change").removeClass('balance-change-click');
    if (num==0){
        if (orderHistory.length==0){
            get_order_change();
        }else{
            reload_order_change();
        }
    }
    if(num==1){
        get_order_change();
    }

}
function reload_order_change() {
    $(".act-acount-month").html('');
    $(".act-acount-history").css({ 'margin-top':''});
        var yearm=[];
        $.each(orderHistory,function (i) {
            var pay_time=orderHistory[i].pay_time;
            var pay_timearr=pay_time.split(' ')[0].split('-');
            var ym=[pay_timearr[0],pay_timearr[1]];
            var flag=0;
            $.each(yearm,function (i) {
                if(ym[0]==yearm[i][0] && ym[1]==yearm[i][1]){
                    flag++
                }
            })
            if (flag==0){
                yearm.push(ym);
            }
        });
        for (var j=0;j<yearm.length;j++){
            var li='<li class="act-acount-month-li"><div class="act-history-month">'+yearm[j][0]+'年'+yearm[j][1]+'月</div>' +
                '<ul class="act-history-detail"></ul></li>';
            $(".act-acount-month").append(li);
            for (var k=0;k<orderHistory.length;k++){
                var pay_time=orderHistory[k].pay_time;
                var pay_timearr=pay_time.split(' ')[0].split('-');
                var date=pay_time.split(' ')[1];
                if (pay_timearr[0]==yearm[j][0]&&pay_timearr[1]==yearm[j][1]){
                    var li='<li class="act-history-detail-li" onclick="look_order_history_detial('+orderHistory[k].order_id+')">' +
                        '<div class="act-name-date">' +
                        '<div class="act-nameanddate"><div class="act-history-name">ordername</div>' +
                        '<div class="act-history-date">'+pay_timearr[1]+'月'+pay_timearr[2]+'日'+'&nbsp;'+date+'<span class="act-refund">&nbsp;refundacount</span>' +
                        '</div></div>' +
                        '</div>' +
                        '<div class="act-history-price"><span class="minus"></span><span class="minus-prices">¥'+orderHistory[k].order_price/100+'</span></div></li>';
                    var refundmoney=0;
                    if(orderHistory[k].refund_records.length!=0){
                        for(var r=0;r<orderHistory[k].refund_records.length;r++){
                            refundmoney+=orderHistory[k].refund_records[r].amount;
                        }
                        if (refundmoney/100==(orderHistory[k].order_price/100)){
                            li=li.replace('refundacount','已全额退款');
                        }else{
                            li=li.replace('refundacount','已退款¥'+refundmoney/100);
                        }
                        li=li.replace('refundacount','已退款¥'+refundmoney/100);
                    }else{
                        li=li.replace('refundacount',' ');
                    }
                    if(orderHistory[k].auto_order_type==1){
                        li=li.replace('ordername','购买会员');
                    }else{
                        li=li.replace('ordername',orderHistory[k].order_name)
                    }
                    if(orderHistory[k].order_name.indexOf('充值')!=-1){
                        li=li.replace('ordername','充值')
                    }
                    $(".act-acount-month-li:eq("+ ($(".act-acount-month-li").length-1)+") .act-history-detail").append(li);
                }
            }
        }
        $(".act-acount-month").append('<li class="act-history-month-last"></li>');

}
    function look_order_history_detial(orderid) {
        $('.act-content').css({display:'none'});
        $('.history-detail').animate({height:"100%",'overflow':'auto'},200);
        $(".act-history-pay-detail").css('display','block');
        var li=' <li class="act-detail-name"><div class="detail-left">商品</div><div class="detail-right">ordername</div></li> ' +
            '<li class="act-detail-title"><div class="detail-left">支付方式</div><div class="detail-right">paymethod</div></li> ' +
            '<li class="act-detail-title "><div class="detail-left">当前状态</div><div class="detail-right" id="current-order-status">orderstatus</div></li> ' +
            '<li class="act-detail-title"><div class="detail-left">支付时间</div><div class="detail-right">paytime</div></li> ' +
            '<li class="act-detail-title"><div class="detail-left">交易单号</div><div class="detail-right">orderid</div></li>';
        $(".act-hisory-detail-ul").html(li)
        $.each(orderHistory,function (i) {
            var history=orderHistory[i];
            if(history.order_id==orderid){
                var cash=''+history.order_price/100+'';
                $(".act-pay-price-money").html('¥&nbsp;'+cash);
                var ht=$(".history-detail").html();
                var ordername=history.order_name;
                var paymethod=history.pay_method;
                var orderstatus=history.order_status;

                if(history.auto_order_type==1){
                    ordername='购买会员';
                }
                if(ordername.indexOf('充值')!=-1){
                    ordername='充值';
                }
                if(paymethod==0){
                    paymethod='未支付';
                }
                else if(paymethod==1){
                    paymethod='余额支付';
                }else if(paymethod==2){
                    paymethod='微信支付';
                }
                if(history.refund_records.length==0){
                    if(orderstatus==2){
                        orderstatus='支付成功'
                    }
                    if(orderstatus==1){
                        orderstatus='未支付';
                    }
                }else{
                    var refundmoney=0;
                    for(var r=0;r<history.refund_records.length;r++){
                        refundmoney+=history.refund_records[r].amount;
                    }
                    if(refundmoney/100==history.order_price/100){
                        orderstatus='已全额退款';
                    }else{
                        orderstatus='已退款 ¥'+refundmoney;
                    }
                }
                $(".history-detail").html(ht.replace('ordername',ordername).replace('paymethod',paymethod).replace('orderstatus',orderstatus).replace('paytime',history.pay_time).replace('orderid',history.order_id))
                if (orderstatus.indexOf('退款')!=-1) {$("#current-order-status").css({'color':'#D23232'})}
            }
        })
    }
