/*! RichDate - v1.1 - 2014-04-01 3:22:53 PM
* Copyright (c) 2014 弘树; Licensed  */
KISSY.add("gallery/RichDate/1.1/index",function(a){function b(a){return i[a+a]||i.YYYY}function c(a){return{year:a.getFullYear(),month:a.getMonth()+1,date:a.getDate(),hour:a.getHours(),minute:a.getMinutes(),second:a.getSeconds()}}function d(a){return new Date(a.year,a.month-1,a.date,a.hour,a.minute,a.second)}function e(a){return a%4==0&&a%100!=0||a%400==0?!0:!1}function f(b){var e=d(b);return a.equals(c(e),b)?e:!1}function g(e,f,g){var h=c(e),i=/^((\d)+[YMDhms]{1}(\s)*)+$/;if(a.isString(f)&&i.test(f)){for(var j,k=/(\d)+[YMDhms]{1}/g;null!=(j=k.exec(f));){var l=j[0],m=parseInt(l,10),n=l[l.length-1],o=b(n);g?h[o]+=m:h[o]-=m}return d(h)}a.error("invalid interval string, please set as '2Y','2M','2D','2h','2m','2s' with their combination!")}function h(b){function c(a){return+a||null}var d=b.match(/\d+/g),e=new Date(b);return a.isDate(e)&&!isNaN(e.getTime())||(e=new Date(c(d[0]),c(d[1]),c(d[2]),c(d[3]),c(d[4]),c(d[5])),void 0!==d[1]&&e.setMonth(e.getMonth()-1),!isNaN(e.getTime()))?e:!1}var i={YYYY:"year",MM:"month",DD:"date",hh:"hour",mm:"minute",ss:"second"};a.mix(Date,{parseBy:function(c,d){c=a.trim(c),d=a.trim(d);var e={year:0,month:0,date:0,hour:0,minute:0,second:0},g=arguments[2]===!1?!1:!0,i=!0,j=!1,k="Date parse failed, please check and retry!";if(c&&d)if(d){for(var l=0,m=0,n=d.length;n>l&&i;l++,m++){var o=d.charAt(l),p=c.charAt(m);if(/[YMDhms]/.test(o)){if("YYYY"==d.substr(l,4)){var q=parseInt(c.substr(m,4),10);isNaN(q)?i=!1:(e.year=q,l+=3,m+=3)}else if(o==d.charAt(l+1)){var r=parseInt(c.substr(m,2),10);isNaN(r)||0>r?i=!1:(e[b(o)]=r,(r>=10||g)&&m++,10>r&&(g&&"0"!=p||!g&&"0"==p)&&(i=!1),l++)}}else o!=p&&(i=!1)}j=i&&f(e)}else j=h(c);return j||a.log(k,"warn"),j}}),a.mix(Date.prototype,{isLeapYear:function(){return e(this.getFullYear())},before:function(a){return g(this,a,!1)},after:function(a){return g(this,a,!0)},formatAs:function(b){function d(a){return 10>a?"0"+a:a}var e=arguments[1]||!1,f=c(this),g=0;return a.each(f,function(a,b){(g++>2||e)&&(f[b]=d(a))}),a.each(i,function(a,c){b=b.replace(c,f[a])}),b}})});