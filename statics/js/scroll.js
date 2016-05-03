(function(window,doc){
    var wrap = doc.getElementsByClassName("scrollWrap")[0];
    isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),
        hasTouch = 'ontouchstart' in window && !isTouchPad,
        START_EV = hasTouch ? 'touchstart' : 'mousedown',
        MOVE_EV = hasTouch ? 'touchmove' : 'mousemove',
        END_EV = hasTouch ? 'touchend' : 'mouseup',
        CANCEL_EV = hasTouch ? 'touchcancel' : 'mouseup';
    var qScroll = function(callBack){
        var that = this;
        that.callBack = callBack;
        that._bind(START_EV,wrap);
        Console.log("lenght"+wrap.length)
    };
    qScroll.prototype = {
        handleEvent: function (e) {
            var that = this;
            switch(e.type) {
                case START_EV:
                    if (!hasTouch && e.button !== 0) return;
                    that._start(e);
                    break;
                case MOVE_EV: that._move(e); break;
                case END_EV:
                case CANCEL_EV: that._end(e); break;
            }
        },
        _start:function(e){
            var self = this;
            var point = hasTouch ? e.touches[0] : e;
            //记录刚刚开始按下的时间
            self.startTime = new Date() * 1;
            //记录手指按下的坐标
            self.startY = point.pageY;
            self._bind(MOVE_EV, window);
            self._bind(CANCEL_EV, window);
            document.getElementById("menu_list").innerHTML="";
            //if($("#server_infomation").css("display")=="block"){
            //    document.addEventListener('touchmove', bodyScroll, false);
            //}
        },
        _move:function(e){
            //$("#dialog").css({"position":'fixed','bottom': '0px'});
            Console.log($("#dialog-info").scrollTop());
            var self = this,point = hasTouch ? e.touches[0] : e;
            //计算手指的偏移量
            self.offsetY = point.pageY - self.startY;
                if(self.offsetY > 0){//下拉
                    Console.log("$('#dialog-info')"+$("#dialog-info").scrollTop());
                    document.activeElement.blur('dialog-input');
                    if($("#dialog-info").scrollTop()<200){
                        if(request_flag==0){
                            //$('.loader').css("display","block");
                            flag++;
                            self._bind(MOVE_EV, window);
                            self._bind(END_EV, window);
                            self._bind(CANCEL_EV, window);
                        }
                    }
                }
            if(self.offsetY < 0){//上拉
                document.activeElement.blur('dialog-input');
                self.actionDir = 'up';
            }
        },
        _end:function(e){
            //document.removeEventListener('touchmove', bodyScroll, false);
            var that = this;
            //if($("#dialog-info").scrollTop()<200 ) {
            that.callBack();
            //}
            //setTimeout(function(){
            //    $(".loader").css("display","none");
            //},3000);
            that._unbind(MOVE_EV, window);
            that._unbind(END_EV, window);
            that._unbind(CANCEL_EV, window);
        },
        _bind: function (type, el, bubble) {
            el.addEventListener(type, this, !!bubble);
        },

        _unbind: function (type, el, bubble) {
            el.removeEventListener(type, this, !!bubble);
        }
    };
    if (typeof exports !== 'undefined') {
        exports.qScroll = qScroll;
    }else{
        window.qScroll = qScroll;
    }

})(window,document);