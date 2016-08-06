var accountHistory=[];
var accoutPages=1;
$(document).ready(function(){
    get_order_history();
    scrollBottomTest()
});
var scrollBottomTest =function(){
    $("#act-content").scroll(function(){
        var $this =$(this),
            viewH =$(this).height(),//可见高度
            contentH =$(this).get(0).scrollHeight,//内容高度
            scrollTop =$(this).scrollTop();//滚动高度
        console.log(scrollTop/(contentH -viewH));
        //if(contentH - viewH - scrollTop <= 100) { //到达底部100px时,加载新内容
        if(scrollTop/(contentH -viewH)==1){ //到达底部100px时,加载新内容
            // 这里加载数据..
            // console.log(currenthistory.length);
            if (currenthistory.length>30){
                accoutPages++;
                get_order_history();
            }
        }
    });
}
function get_order_history() {
       var url='http://'+localHost+'/api_s/account_history';
    // var url='http://www.essential.com.cn/api_s/order_history?page='+accoutPages;
    $.ajax({
        url: url,
        dataType: "json",
        type: "get",
        success: function (data) {
            accountHistory=accountHistory.concat(data);
            console.log(JSON.stringify(data));
            if (data.length!=0){
//                    $(".act-acount-history").css({'margin-top':'9.7vh','border-top':'1px solid rgba(216, 216, 216, 0.3)'})
                var yearm=[];
                $.each(data,function (i) {
                    var pay_time=data[i].pay_time;
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
                for (var j=(yearm.length-1);j>-1;j--){
                    var li='<li class="act-acount-month-li"><div class="act-history-month">'+yearm[j][0]+'年'+yearm[j][1]+'月消费记录</div>' +
                        '<ul class="act-history-detail"></ul></li>';
                    $(".act-acount-month").append(li);
                    for (var k=0;k<data.length;k++){
                        var pay_time=data[k].pay_time;
                        var pay_timearr=pay_time.split(' ')[0].split('-');
                        var date=pay_time.split(' ')[1];
                        if (pay_timearr[0]==yearm[j][0]&&pay_timearr[1]==yearm[j][1]){
                            var li='<li class="act-history-detail-li" onclick="look_acount_history_detial('+data[k].order_id+')">' +
                                '<div class="act-name-date">' +
                                '<div class="act-nameanddate"><div class="act-history-name">ordername</div>' +
                                '<div class="act-history-date">'+pay_timearr[1]+'月'+pay_timearr[2]+'日'+'&nbsp;'+date+'<span class="act-refund">&nbsp;refundacount</span></div></div>' +
                                '</div>' +
                                '<div class="act-history-price">¥'+data[k].order_price/100+'</div></li>';
                            var refundmoney=0;
                            if(data[k].refund_records.length!=0){
                                for(var r=0;r<data[k].refund_records.length;r++){
                                    refundmoney+=data[k].refund_records[r].amount;
                                }
                                if (refundmoney/100==(data[k].order_price/100)){
                                    li=li.replace('refundacount','已全额退款');
                                }else{
                                    li=li.replace('refundacount','已退款¥'+refundmoney/100);
                                }
                                li=li.replace('refundacount','已退款¥'+refundmoney/100);
                            }else{
                                li=li.replace('refundacount',' ');
                            }
                            if(data[k].auto_order_type==1){
                                li=li.replace('ordername','购买会员');
                            }else{
                                li=li.replace('ordername',data[k].order_name)
                            }
                            if(data[k].order_name.indexOf('充值')!=-1){
                                li=li.replace('ordername','充值')
                            }
                            $(".act-acount-month-li:eq("+ ($(".act-acount-month-li").length-1)+") .act-history-detail").append(li);
                        }
                    }
                }
                $(".act-acount-month").append('<li class="act-history-month-last"></li>');
            }else{
                var li='<li class="act-no-history">暂无消费记录</li>';
                $(".act-acount-month").append(li);
                $(".act-acount-history").css({'top':'50%'})
            }

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest);
            console.log(errorThrown);
            console.log(textStatus);
        }
    })
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
    $(".act-hisory-detail-ul").html(li)
    $.each(accountHistory,function (i) {
        var history=accountHistory[i];
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
            if(paymethod==2){
                paymethod='未支付';
            }
            else if(paymethod==1){
                paymethod='余额支付';
            }else if(paymethod==0){
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
function close_detail_act() {
    $('.history-detail').animate({height:"0px",'overflow':'hidden'},200);
    $(".act-history-pay-detail").css('display','none');
    $('.act-content').css({display:'block'});
}
