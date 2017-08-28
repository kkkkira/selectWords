/**
 * Created by 小黑 on 2017/8/21.
 */
/**
 * @param name         命名空间
 * @param instance     实例
 * @param defaults     默认选项
 * @param options      配置选项
 * @param selectedText = {
 *           allText: ['','',''],
 *           enWords:{
 *              'a': {
 *                  count: num
 *               }
 *              'b': {
 *                  count: num
 *              }
 *           },
 *           chWords:{}
 *        }
 *@param ParseText.rules = {
 *          custom: false,
 *          all: true,
 *          words: '',
 *          num: ''
 *        }
 ************************************
 *
 *
 *
 * 调用方式 $().captureWords();
 *
 **/



;(function ($, window, document, undefined) {
    var name = 'captureWords',
        $ele = {},                         //指向绑定的jquery对象  $ele instanceof $  -> true
        instance = null,                   //instance 是一个CaptureWords对象
        defaults = {
            type: 'mouseup',                //选词触发事件类型
            rule: 'enWords',
            beforeSelect:function(){},
            afterSelect:function(){},
            onSelect:function(){},
            cancelSelect:function(){}
        };
    var testText = [];

    var CaptureWords = function (options) {
        this.opts = $.extend(true, defaults, options);
        this.selectedText = [];
        this.handlers = [];
        this.listeners = [];
        this.parseText = new ParseText();
        this.init();
    };

    CaptureWords.prototype = {
        constructor: CaptureWords,
        selectedText:{},

        /**
        * init： 初始化
        * 绑定取词事件到元素上
        * 必须为_self.setText绑定this值，否则内部this值将会指向$ele
        * 不能使用jquery的on事件 因为on事件是jquery对象的方法 而不是CaptureWords对象的方法
        * 可扩展：订阅不同的事件
        *
        * */
        init: function () {
            var _self = this;
            $ele.on(_self.opts.type, function(event){
                _self.setText(event , _self.opts.rule);
            });
        },

        /**
         * setText: 获取到页面中的文本信息，处理，并存入缓存
         * @function parseText.getWords(text,type) 解析提取的文本，文本中的单词
         *
         **/
        setText: function ( e, rule ) {
            var _self = this,
            //原本_self 指向p元素（原生Dom） 后在上级.on事件中绑定了this值，所以现在指向captureWords对象
                text  = {}, words;
            e.stopPropagation();
            text.allText = this.selectText();

            if( !text.allText ){
                this.error();
                return;
            }
            //需要优化:如果文本存在，去重:非第一次获取时才进入判断
            if( this.selectedText.length, rule ){

                if( this.parseText.hadWords( this.selectedText, text.allText, 'allText') ){
                    //当存在文本时，返回true,此时不进行后续操作
                    console.log(this.selectedText);
                    return;
                }
            }
            //可以用策略模式 parseText可以做为工具来引入
            if (this.selectedText.length >= 2){
                console.log(testText);
                console.log(testText[0] == testText[1]);
            }
            words = this.parseText.getWords(text.allText, rule);
            //判断是否存在
            if( !words ){
                this.error(rule);
            }
            text[rule] = this.parseText.calculateTimes(words);
            this.selectedText.push(text);
            console.log(this.selectedText);
        },

        /**
         * 获取页面中选中的文本信息
         * 第一次执行之后，getText方法已经变为最新的了
         **/
        selectText: function() {
            //只执行一次
            var _self = this;
            if (window.getSelection) {
                this.selectText = function () {
                    testText.push(window.getSelection().baseNode.parentElement);
                    // console.log(window.getSelection().baseNode.parentElement);
                    // console.log(window.getSelection());
                    return window.getSelection().toString();
                }
            } else if (document.selection) {
                this.selectText = function () {
                    console.log(document.selection);
                    return document.selection.createRange().text;
                }
            }

            return this.selectText();           //返回执行结果
        },

        renderText: function () {

        },
        on: function (type, handler) {

            // 事件订阅 type: show, shown, hide, hidden, close, confirm
            if (typeof this.handlers[type] === 'undefined') {
                this.handlers[type] = [];
            }
            this.listeners.push(type);
            this.handlers[type].push(handler);
            console.log(this.listeners);
            return this;
        },
        off: function (type, handler) {                  //取消事件订阅
            if (this.handlers[type] instanceof Array) {
                var handlers = this.handlers[type];
                for (var i = 0, len = handlers.length; i < len; i++) {
                    if (handlers[i] === handler) {
                        break;
                    }
                }
                this.listeners.splice(i, 1);
                handlers.splice(i, 1);
                return this;
            }
        },
        emit: function ( event ) {                          //发布事件
            if (!event.target) {
                event.target = this;
            }
            if (this.handlers[event.type] instanceof Array) {
                var handlers = this.handlers[event.type];
                for (var i = 0, len = handlers.length; i < len; i++) {
                    handlers[i](event);
                    return true;
                }
            }
            return false;
        },
        bind: function ( type,fn ) {
            //绑定命名空间
            //resize是默认事件 .Plugin这是定义的命名空间
            // $(window).bind('resize.Plugin',fn);
        },
        destroy: function () {
            //解绑事件
            //解除 绑定在.Plugin下所有的事件
            //$(window).unbind('.Plugin');
        },
        error: function (type) {
            console.log("There aren't %s in this text!\n", type);
        }
    };

    $.fn[name] = function (arg) {
        $ele = this;
        var type = $.type(arg);
        if (type === "object") {
            //设置单例模式，if(single)
            instance = new CaptureWords(arg);
            // $.data(this, name, instance);
            return this;
        }
        if (type === "string" && arg === "destroy") {
            //可自定义
            // instance.destroy();
            // $.removeData(this, name);
            // return this;
        }
        return this;
    };
})(jQuery, window, document);


