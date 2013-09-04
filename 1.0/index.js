/**
 * @fileoverview 
 * @author hongshu<tiehang.lth@taobao.com>
 * @module RichDate
 **/
KISSY.add(function (S) {
    var EMPTY = '';
    var $ = Node.all;


    /**
     * mix Date with util functions
     */
    S.mix(Date, {

        /**
         * parse given date string with the given pattern
         * @param pattern desired time pattern, e.g.'YYYY-MM-DD hh:mm:ss'
         */
        parse: function(pattern){

        },

        /**
         * format date object to given format string
         * @param pattern desired time pattern, e.g.'YYYY-MM-DD hh:mm:ss'
         */
        format: function(pattern){

        }
    });

    /**
     * mix Date instance with util functions
     */
    S.mix(Date.prototype, {

        /**
         * get specified time before the time
         * @param time e.g.'2Y','2M','2D','2h','2m','2s'
         */
        before: function(time){
            console.log(time);
        },

        /**
         * get specified time after the time
         * @param time e.g.'2Y','2M','2D','2h','2m','2s'
         */
        after: function(time){
            console.log(time);
        },

        /**
         * get the time has lasted to now
         */
        ago: function(){
            var now = S.now();
            return now - this.getTime();
        }
    });

});



