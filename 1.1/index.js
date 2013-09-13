/**
 * @fileoverview 
 * @author 弘树<tiehang.lth@taobao.com>
 * @module RichDate
 **/
KISSY.add(function (S) {

    var SIGNS = {
        'YYYY': 'year',
        'MM': 'month',
        'DD': 'date',
        'hh': 'hour',
        'mm': 'minute',
        'ss': 'second'
    };

    // process relate mapping for such as 'YYYY->Y->year', 'MM->m->month'
    function convertSign(unit){
        return SIGNS[unit+unit] || SIGNS['YYYY'];
    }

    var DEFAULT_PATTERN = 'YYYY-MM-DD hh:mm:ss';

    var formatObj = {
        year: 0,
        month: 0,
        date: 0,
        hour: 0,
        minute: 0,
        second: 0
    };

    /**
     * transform given date object to formatted date object
     * @param date
     * @returns {{year: number, month: number, date: number, hour: number, minute: number, second: number}}
     */
    function dateToFormatted(date){
        return {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            date: date.getDate(),
            hour: date.getHours(),
            minute: date.getMinutes(),
            second: date.getSeconds()
        };
    }

    /**
     * transform formatted date object back to js date object
     * @param fo formatted date object
     * @returns {Date}
     */
    function formattedToDate(fo){
        return new Date(fo.year, fo.month-1, fo.date, fo.hour, fo.minute, fo.second);
    }

    /**
     * check if given year is leap year
     * @param year number
     * @returns {boolean}
     */
    function isLeapYear(year){

        if((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)){
            return true;
        }
        return false;
    }

    /**
     * check if given formatted object is valid date
     * using date auto convert to compare before & after is equal
     * @param obj formatted object
     * @returns {boolean|Date}
     */
    function isValidDate(obj){

        var toDateObj = formattedToDate(obj);

        // KISSY's hidden api: equals[https://github.com/kissyteam/kissy/blob/master/src/seed/src/lang/lang.js]
        if(S.equals(dateToFormatted(toDateObj), obj)){
            // two hash object equals, valid date
            return toDateObj;
        }

        return false;

    }

    /**
     * execute date shift(before, after) according to given gap and direction(before/after)
     * @param dateObj the given date object
     * @param interval string, e.g.'2Y','22M','222D','2222h','222m','22s' with their combinations
     * @param direction boolean (true: after, false: before)
     * @returns {*}
     */
    function dateShift(dateObj, interval, direction){

        var formatObj = dateToFormatted(dateObj);
        var gapReg = /^((\d)+[YMDhms]{1})+$/;

        // check if interval matches defined pattern
        if(S.isString(interval) && gapReg.test(interval)){

            // child regexp for filter every interval item, such as '12Y'
            var matchReg = /(\d)+[YMDhms]{1}/g;

            var matchArr;
            while((matchArr = matchReg.exec(interval)) !=null){

                // arr[0]为单次的全匹配结果
                var matchedGap = matchArr[0];
                // filter number and unit
                var gapValue = parseInt(matchedGap);
                var gapUnit = matchedGap[matchedGap.length - 1];
                var relKey = convertSign(gapUnit);

                if(direction){
                    // true: after
                    formatObj[relKey] += gapValue;
                }else{
                    // false: before
                    formatObj[relKey] -= gapValue;
                }

            }

            return formattedToDate(formatObj);

        }else{
            S.error("invalid interval string, please set as '2Y','2M','2D','2h','2m','2s' with their combination!");
        }

    }

    function parseBy(str, timeArr, pattern, isForceLeadingZero){

        var posArr = [];

        // get 'YYYY', 'MM', ... 's position, so that we can know timeArr[i] means year or month or others
        // returns such as ['year',,,,'month',,'date', ...]
        S.each(SIGNS, function(item, key){
            var idx = pattern.indexOf(key);
            posArr[idx] = item;
        });

        // walk posArr, set corresponding attributes of formatObj
        for(var i = 0, j = 0, len = posArr.length; i < len; i++){
            var attr = posArr[i];
            if(attr){
                formatObj[attr] = timeArr[j++];
            }
        }

        // check if formatObj is valid date
        // using date auto convert to compare before & after is equal
        var toDateObj = formattedToDate(formatObj);

        // KISSY's hidden api: equals[https://github.com/kissyteam/kissy/blob/master/src/seed/src/lang/lang.js]
        var eq = S.equals;
        if(eq(dateToFormatted(toDateObj), formatObj) && eq(toDateObj.formatAs(pattern, isForceLeadingZero), str)){

            // two hash object equals, valid date
            // convert back to date string, compare to original string
            return toDateObj;
        }else{

            // parse failure, return false
            S.log('Date parse error', 'warning');
            return false;
        }

    }



    /**
     * mix Date with util functions
     */
    S.mix(Date, {


        parseStr: function(str/*, pattern, isForceLeadingZero*/){

            str = S.trim(str);
            var pattern = arguments[1];
            var isForceLeadingZero = arguments[2] || true;
            var timeArr = str.match(/\d+/g);

            var result = false;

            if(pattern){


            }else{

                pattern = DEFAULT_PATTERN;

                // native parse, with help from native Date constructor
                result = new Date(str);
                if(!S.isDate(result) || isNaN(result.getTime())){

                    // native parse fail, parse according to default pattern


                }

            }

            var yearIdx = pattern.indexOf('YYYY'),
                monthIdx = pattern.indexOf('MM'),
                dateIdx = pattern.indexOf('DD'),
                hourIdx = pattern.indexOf('hh'),
                minuteIdx = pattern.indexOf('mm'),
                secondIdx = pattern.indexOf('ss');



            return result;
        },

        /**
         * parse given date string by the given pattern
         * ie native support date string rule: http://msdn.microsoft.com/zh-cn/library/ie/ff743760(v=vs.94).aspx
         * @param str given date string
         * @param pattern desired time pattern, e.g.'YYYY-MM-DD hh:mm:ss'
         */
        parseBy: function(str, pattern){

            str = S.trim(str);
            pattern = S.trim(pattern);

            var valValidFlag = true;
            var result = true;
            var errorMsg = 'Date parse failed, please check and retry!';

            if(str && pattern){
                // i pointer for pattern & j pointer for str
                for(var i = 0, j = 0, len = pattern.length; (i < len) && valValidFlag; i++, j++){

                    var pa = pattern.charAt(i);
                    var st = str.charAt(j);

                    if(/[YMDhms]/.test(pa)){

                        // check if pa and following 3 chars match 'YYYY'
                        if(pattern.substr(i, 4) == 'YYYY'){

                            // deal with year
                            var year = parseInt(str.substr(j, 4));
                            if(isNaN(year)){
                                valValidFlag = false;
                            }else{
                                formatObj.year = year;
                                i += 3;
                                j += 3;
                                continue;
                            }

                        }else if(pa == pattern.charAt(i + 1)){

                            // deal with others
                            var val = parseInt(str.substr(j, 2));
                            if(isNaN(val) || val < 0){
                                valValidFlag = false;
                            }else{
                                formatObj[convertSign(pa)] = val;
                                (str[j] == '0' || val >= 10) && j++; // fix leading zero auto apply
                                i++;
                                continue;
                            }

                        }

                    }

                    // if trans value error || string doesn't match pattern
                    if(!valValidFlag || pa != st){
                        S.log(errorMsg);
                        return false;
                    }

                }

                result = isValidDate(formatObj);
                if(!result){
                    S.log(errorMsg);
                }

                return result;
            }

            S.log(errorMsg);
            return false;
        }

    });

    /**
     * mix Date instance with util functions
     */
    S.mix(Date.prototype, {

        /**
         * check if current year is leap year
         * @returns {boolean}
         */
        isLeapYear: function(){

            return isLeapYear(this.getFullYear());
        },

        /**
         * get specified time before the time
         * @param interval e.g.'2Y','2M','2D','2h','2m','2s'
         */
        before: function(interval){

            return dateShift(this, interval, false);
        },

        /**
         * get specified time after the time
         * @param interval e.g.'2Y','22M','222D','2222h','222m','22s' with their combinations
         */
        after: function(interval){

            return dateShift(this, interval, true);

        },

        /**
         * format the time as the given pattern
         * @param pattern given pattern
         * @hidden param isLeadingZero for month, date, hour, minute & second, decide whether needs leading zero
         * @returns {string}
         */
        formatAs: function(pattern/*, isLeadingZero*/){

            var isLeadingZero = arguments[1] || false;

            var formatObj = dateToFormatted(this);

            function fillZero(val){
                return (val < 10) ? ('0' + val) : val;
            }
            if(isLeadingZero){
                S.each(formatObj, function(val, key){
                    formatObj[key] = fillZero(val);
                })
            }

            S.each(SIGNS, function(item, key){
                pattern = pattern.replace(key, formatObj[item]);
            });

            return pattern;

        }
    });

});