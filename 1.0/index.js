/**
 * @fileoverview 
 * @author hongshu<tiehang.lth@taobao.com>
 * @module RichDate
 **/
KISSY.add(function (S, Base) {
    var EMPTY = '';
    var $ = Node.all;


    /**
     * mix Date with util functions
     */
    S.mix(Date, {

        /**
         * parse given date string
         */
        parse: function(){

        },

        /**
         * format date object to given format string
         */
        format: function(){

        }
    });

    S.extend(Date, Base, /** @lends Date.prototype*/{
        
    });

    /**
     * 
     * @class RichDate
     * @constructor
     * @extends Base
     */
    function RichDate(comConfig) {
        var self = this;
        //调用父类构造函数
        RichDate.superclass.constructor.call(self, comConfig);
    }
    S.extend(RichDate, Base, /** @lends RichDate.prototype*/{

    }, {ATTRS : /** @lends RichDate*/{

    }});
    return RichDate;
}, {requires:['base']});



