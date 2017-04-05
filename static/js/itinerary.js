var route=new Object({
    date:function () {
        var routeDate=new Date();
        var routeMon=routeDate.getMonth()+1;
        var routeDay=routeDate.getDate();
        var dateArr=[];
        if (routeMon<10){
            routeMon='0'+routeMon
        }
        dateArr.push(routeMon);
        if(routeDay<10){
            routeDay='0'+routeDay
        }
        dateArr.push(routeDay);
        return dateArr
    },
    getData:function () {
        var url='http://'+window.location.host+'/api/itinerary?itinerary_code='+icode;
        $.ajax({
            type:'GET',
            url:url,
            dataType:'json',
            success:function (data) {
                var data=data;
                console.log(data);
                var sdft=data['航班号'];
                var dcc=data['出发地'];
                var acc=data['目的地'];
                var dt=data['出发时间'];
                var at=data['到达时间'];
                var price=data['价格'];
                var cw=data['舱位'];
                var ft=data['飞行时间'];
                var company=data['航空公司'];
                var ActualDate_m = dt.split('T')[0].split('-')[1];
                var ActualDate_d = dt.split('T')[0].split('-')[2];
                var TodayDate=route.date();
                if(parseInt(ActualDate_m)==parseInt(TodayDate[0])&&parseInt(ActualDate_d)==parseInt(TodayDate[1])){
                    $('.today-dis').css('display','inline');
                }
                if(parseInt(ActualDate_m)==parseInt(TodayDate[0])&&parseInt(ActualDate_d)==(parseInt(TodayDate[1])+1)){
                    $('.today-dis').css('display','inline');
                    $('.today-dis').html('明天');
                }
                if(parseInt(ActualDate_m)==parseInt(TodayDate[0])&&parseInt(ActualDate_d)==(parseInt(TodayDate[1])+2)){
                    $('.today-dis').css('display','inline');
                    $('.today-dis').html('后天');
                }
                $('#route-date-m').html(ActualDate_m);
                $('#route-date-d').html(ActualDate_d);
                if (cw=='Economy'){cw='经济舱';}
                var module=['plane','traffic','restaurant','hotel'];
                for(var i=0;i<module.length;i++){
                    var div='',
                        block='';
                    if (module[i]=='plane'){
                         div=templates.plane(dt,at,dcc,acc,company,sdft,ft,cw,price);
                         block='<div class="route-block">'+div+'</div>';
                    }
                    if(module[i]=='traffic'){
                        var title='未安排交通',stitle1='上车地点',stitle2='目的地',stitle3='预计时间';
                         div=templates.comment(title,stitle1,stitle2,stitle3).
                         replace('route-block-xxx','route-block-traffic').replace('picturesrc','itin_icon_pending')
                             .replace('route-xxx-con','route-traffic-con');
                         block='<div class="route-block route-block-traffic-con">'+div+'</div>';
                    }
                    if (module[i]=='restaurant'){
                        var title='未安排餐厅就餐',stitle1='推荐',stitle2='菜系',stitle3='人均价格';
                        div=templates.comment(title,stitle1,stitle2,stitle3).
                        replace('route-block-xxx','route-block-restaurant').replace('picturesrc','itin_icon_mappending').
                        replace('route-xxx-con','route-restaurant-con route-traffic-con');
                        block='<div class="route-block route-block-traffic-con">'+div+'</div>';
                    }
                    if (module[i]=='hotel'){
                        var title='未选择酒店',stitle1='房型',stitle2='床型',stitle3='早餐';
                        div=templates.comment(title,stitle1,stitle2,stitle3).
                        replace('route-block-xxx','route-block-hotel').replace('picturesrc','itin_icon_mappending').
                        replace('route-xxx-con','route-restaurant-con route-traffic-con');
                        block='<div class="route-block route-block-traffic-con">'+div+'</div>';
                    }
                    $("#route-content").append(block);
                }
                var editIti='<div class="route-update" onclick="route.update()">修改行程</div>';
                $("#route-edit").append(editIti)
            },
            error:function (xhr, type) {
                alert('Ajax error!')
            }
        })
    },
    update:function(){
        window.location.href="http://"+window.location.host;
    },
    prevent:function () {
        var startX = 0, startY = 0;
        //touchstart事件
        function touchSatrtFunc(evt) {
            try
            {
                //evt.preventDefault(); //阻止触摸时浏览器的缩放、滚动条滚动等

                var touch = evt.touches[0]; //获取第一个触点
                var x = Number(touch.pageX); //页面触点X坐标
                var y = Number(touch.pageY); //页面触点Y坐标
                //记录触点初始位置
                startX = x;
                startY = y;

            } catch (e) {
                console.log('touchSatrtFunc：' + e.message);
            }
        }
        document.getElementById('contain').addEventListener('touchstart', touchSatrtFunc, false);
        $('.route-date').on('touchmove',function (e) {
            e.preventDefault();
        });
        $('.route-edit').on('touchmove',function (e) {
            e.preventDefault();
        });
        var _ss = document.getElementById('contain');
        _ss.ontouchmove = function (ev) {
            var _point = ev.touches[0],
                _top = _ss.scrollTop;
            // 什么时候到底部
            var _bottomFaVal = _ss.scrollHeight - _ss.offsetHeight;
            // 到达顶端
            if (_top === 0) {
                // 阻止向下滑动
                if (_point.clientY > startY) {
                    ev.preventDefault();
                } else {
                    // 阻止冒泡
                    // 正常执行
                    ev.stopPropagation();
                }
            } else if (_top === _bottomFaVal) {
                // 到达底部
                // 阻止向上滑动
                if (_point.clientY < startY) {
                    ev.preventDefault();
                }
                else {
                    // 阻止冒泡
                    // 正常执行
                    ev.stopPropagation();
                }
            } else if (_top > 0 && _top < _bottomFaVal) {
                ev.stopPropagation();
            } else {
                ev.preventDefault();
            }
        };
    }
});
var templates={};
templates.plane=(function(dt,at,dcc,acc,company,sdft,ft,cw,price) {
    var div='<div class="route-time-line">'+
        '<div class="route-times-left">'+
        '<div class="route-time">'+dt.split('T')[1].split(':')[0]+':'+dt.split('T')[1].split(':')[1]+'</div>'+
        '<div class="route-time-desc">起飞</div>'+
        '</div>'+
        '<div class="route-time-center">'+
        '<div class="route-line route-line-plane">'+
        '<div class="route-line-icon"></div>'+
        '</div>'+
        '</div>'+
        '<div class="route-times-right">'+
        '<div class="route-fit">'+
        '<div class="route-fit-s">'+dcc+'</div>'+
        '<div class="route-fit-s route-fit-arrow"><img src="../static/images/itin_icon_arrow.png"></div>'+
        '<div class="route-fit-s">'+acc+'</div>'+
        '</div>'+
        '<div class="route-fit-content">'+
        '<div class="route-aviation">'+
        '<div class="route-aviation-name">'+company+' '+sdft+'</div>'+
        '<div class="route-fly-price">¥ '+price+'<span class="r-unit">/人</span></div>'+
        '</div>'+
        '<div class="route-flyTime">飞行时间: '+parseInt(ft/60)+'小时'+ft%60+'分钟'+'</div>'+
        '<div class="route-space">舱位:'+cw+'</div>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '<div class="route-time-line ">'+
        ' <div class="route-times-left">'+
        '<div class="route-time">'+at.split('T')[1].split(':')[0]+':'+at.split('T')[1].split(':')[1]+'</div>'+
        ' </div>'+
        '<div class="route-time-center">'+
        '<div class="route-line route-time-acc">'+
        '<div class="route-line-icon route-line-icon-untake route-block-arrive"></div>'+
        '</div>'+
        '</div>'+
        '<div class="route-times-right">'+
        '<div class="route-fit-untake">抵达'+acc+'</div>'+
        '</div>'+
        '</div>'+
        '<span class="route-division-line"></span>';
    return div;
});
templates.comment=(function (title,stitle1,stitle2,stitle3) {
    var div=  '<div class="route-time-line">'+
        '<div class="route-times-left"></div>'+
        '<div class="route-time-center">'+
        '<div class="route-line route-line-commen">'+
        '<div class="route-line-icon route-line-icon-untake route-block-xxx"></div>'+
        '</div>'+
        '</div>'+
        '<div class="route-times-right">'+
        '<div class="route-fit route-xxx">'+
        '<div>'+title+'</div>'+
        '<div class="route-xxx-con">'+
        '<img src="../static/images/picturesrc.png">'+
       ' <span>待定</span>'+
        '<span class="route-traffic-line"><img src="../static/images/itin_view.png"></span>'+
        '</div>'+
        '</div>'+
        '<div class="route-fit-content route-traffic-content">'+
        '<div class="route-aviation">'+
        '<div class="route-aviation-name">'+stitle1+'：待定</div>'+
    '</div>'+
    '<div class="route-flyTime">'+stitle2+'：待定</div>'+
    '<div class="route-space">'+stitle3+'：待定</div>'+
    '</div>'+
    '</div>'+
    '</div>'+
    '<span class="route-division-line"></span>';
    return div;
});
route.getData();
route.prevent();