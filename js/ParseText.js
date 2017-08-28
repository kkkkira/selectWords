;(function (undefined) {
    // plugin.js
    "use strict";
    var _global;


    var ParseText = function () {
    };
    ParseText.prototype = {
        constructor : ParseText,
        rules:{
            custom: false,
            all: true,
            num: /\d+(\.\d+)*%?/g,
            enWords:/\b[A-z]+\b/g,
            chWords:/.*/g
        },
        setParseRule: function () {
            //设置关键字的rule
        },
        parsePath: function ( path ) {
            var pathArr = path.split('.'),
                rule = this.rules,
                len = pathArr.length,
                i = 0;
            for( i; i<len; i++ ){
                rule = rule[pathArr[i]];
            }
            return rule;
        },

        /**
         * calculateTimes: 统计次数
         * @param arr 需要统计的单词数组
         * @return words 返回统计好的数组
         *
         **/
        calculateTimes: function ( arr ) {
            var words = {},
                i = 0,
                word,
                len = arr.length;
            for(i; i < len; i++ ){
                word = arr[i];
                if( !words[word] ){
                    words[word] = 1;
                }else{
                    words[word] += 1;
                }
            }
            return words;
        },

        /**
         * getWords: 解析文本
         * @param text 需要解析的文本
         * @param type 需要提取的文本类型，通过type在rules中获得相应的解析规则
         * @return arr 返回解析之后的文本数组
         *  
         **/
        getWords: function ( text, type ) {
            var rule,
                testPath = /\w+(\.\w+)+/g;
            if(typeof type === 'boolean' && type ){
                //在all中也要去调用一下路径解析
            }
            //测试是否需要解析路径
            if(testPath.test(type)){
                rule = this.parsePath(type);
            }else {
                rule = this.rules[type];
            }
            var arr = text.match(rule);

            if(arr === null){
                return false;
            }

            return arr;
        },

        /**
         * hadWords: 去重，判断文本是否存在
         * @param arr 文本组
         * @param words 匹配的文本段
         * @return true 文本存在; false 文本不存在
         * 还是耦合了，规定了arr的数据结构必须是数组，而且必须传入tagName
         *
         **/
        hadWords: function ( arr, text, tagName ) {
            var i = 0,
                len = arr.length;
            for ( i; i<len; i++ ){
                if( text.trim() == arr[i][tagName].trim()){
                    return true;
                }
            }
            return false;
        },

        /**
         * findLCString: 求两个字符串的最大公共子串
         * @param str1 子串1
         * @param str2 子串2
         * @return 最大公共子串存在，返回最大公共子串，否则返回-1 表示不存在最大公共子串
         * 还是耦合了，规定了arr的数据结构必须是数组，而且必须传入tagName
         *
         **/
        findLCString: function(str1, str2){
            var common = {
                str:'',
                start: 0,
                end: 0
            }
        }
    };

    // 最后将插件对象暴露给全局对象
    _global = (function () {
        return this || (typeof window !== 'undefined' ? window : global);
    }());
    if (typeof module !== "undefined" && module.exports) {
        module.exports = plugin;
    } else if (typeof define === "function" && define.amd) {
        define(function () {
            return plugin;
        });
    } else {
        !('ParseText' in _global) && (_global.ParseText = ParseText);
    }
}());