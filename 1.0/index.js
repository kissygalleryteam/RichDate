/**
 * @fileoverview 
 * @author hongshu<tiehang.lth@taobao.com>
 * @module RichDate
 **/
KISSY.add(function (S) {
    var EMPTY = '';

    var MONTH_30_DAYS = [4, 6, 9, 11];
    var SIGNS = {
        'Y': 'year',
        'M': 'month',
        'D': 'date',
        'h': 'hour',
        'm': 'minute',
        's': 'second'
    };
    var SIGNS_KEYS = S.keys(SIGNS);

    var formatObj = {
        year: 0,
        month: 0,
        date: 0,
        hour: 0,
        minute: 0,
        second: 0
    };

    // range map for different unit, date should be decided by isLeapYear
    var rangeMap = {
        year: [1, 9999],
        month: [1, 12],
        date: [1, 31],
        hour: [0, 60],
        minute: [0, 60],
        second: [0, 60]
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
            minute: date.getHours(),
            second: date.getSeconds()
        };
    }

    /**
     * transform formatted date object back to js date object
     * @param formattedObj
     * @returns {Date}
     */
    function formattedToDate(formattedObj){
        return new Date(formattedObj.year, formattedObj.month-1, formattedObj.date,
            formattedObj.hour, formattedObj.minute, formattedObj.second);
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
     * @param obj formatted object
     * @returns {boolean|Date}
     */
    function isValidDate (obj){

        var valid = true;
        obj.isLeapYear = isLeapYear(obj.year);

        var maxDate = 31;
        if(S.inArray(obj.month, MONTH_30_DAYS)){
            maxDate = 30;
        }else if(obj.month == 2){
            maxDate = obj.isLeapYear ? 29 : 28;
        }

        // reset rangeMap's date range according to maxDate
        rangeMap.date[1] = maxDate;

        S.each(rangeMap, function(range, key){
            if(range[0] > obj[key] || range[1] < obj[key]){
                valid = false;
                return false;
            }
        });
        return valid && formattedToDate(obj);
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

                if(direction){
                    // true: after
                    formatObj[SIGNS[gapUnit]] += gapValue;
                }else{
                    // false: before
                    formatObj[SIGNS[gapUnit]] -= gapValue;
                }

            }

            return formattedToDate(formatObj);

        }else{
            S.error("invalid interval string, please set as '2Y','2M','2D','2h','2m','2s' with their combination!");
        }

    }


    /**
     * mix Date with util functions
     */
    S.mix(Date, {

        /**
         * parse given date string by the given pattern
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

                    var pa = pattern[i];
                    var st = str[j];

                    if(S.inArray(pa, SIGNS_KEYS)){

                        if(pa == 'Y' && pattern[i + 1] == 'Y' && pattern[i + 2] == 'Y' && pattern[i + 3] == 'Y'){

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


                        }else if(pa == pattern[i + 1]){

                            // deal with others
                            var val = parseInt(str.substr(j, 2));
                            if(isNaN(val) || val < 0){
                                valValidFlag = false;
                            }else{
                                formatObj[SIGNS[pa]] = val;
                                (str[j] == '0') && j++; // fix leading zero auto apply
                                i++;
                                continue;
                            }

                        }

                    }

                    // if trans value error || string doesn't match pattern
                    if(!valValidFlag || pa != st){
                        result = false;
                        S.error(errorMsg);
                        return false;
                    }

                }

                return isValidDate(formatObj) || S.error(errorMsg);
            }

            S.error(errorMsg);
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
         * @param pattern
         * @hidden param isLeadingZero for month, date, hour, minute & second, decide whether needs leading zero
         * @returns {string}
         */
        formatAs: function(pattern){

            var isLeadingZero = arguments[1] || false;

            var timeObj = dateToFormatted(this);
            var toStr = '';

            if(S.isString(pattern)){
                for(var i = 0; (i < pattern.length); i++){
                    var pa = pattern[i];
                    if(S.inArray(pa, SIGNS_KEYS)){

                        if(pa == 'Y' && pattern[i + 1] == 'Y' && pattern[i + 2] == 'Y' && pattern[i + 3] == 'Y'){

                            toStr += timeObj.year;
                            i += 3;
                        }else if(pa == pattern[i + 1]){

                            var val = timeObj[SIGNS[pa]];

                            // add leading zero
                            if(isLeadingZero && (val < 10)){
                                val = '0' + val;
                            }

                            toStr += val;
                            i++;

                        }else{

                            toStr += pa;
                        }
                    }else{

                        toStr += pa;
                    }
                }
            }

            return toStr;

        }
    });

});