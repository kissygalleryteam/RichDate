/*! RichDate - v1.1 - 2013-09-11 9:03:17 PM
* Copyright (c) 2013 弘树; Licensed  */
KISSY.add("gallery/RichDate/1.1/index",function(a){function b(a){return{year:a.getFullYear(),month:a.getMonth()+1,date:a.getDate(),hour:a.getHours(),minute:a.getMinutes(),second:a.getSeconds()}}function c(a){return new Date(a.year,a.month-1,a.date,a.hour,a.minute,a.second)}function d(a){return 0==a%4&&0!=a%100||0==a%400?!0:!1}function e(d){var e=c(d);return a.equals(b(e),d)?e:!1}function f(d,e,f){var h=b(d),i=/^((\d)+[YMDhms]{1})+$/;if(a.isString(e)&&i.test(e)){for(var j,k=/(\d)+[YMDhms]{1}/g;null!=(j=k.exec(e));){var l=j[0],m=parseInt(l),n=l[l.length-1];f?h[g[n]]+=m:h[g[n]]-=m}return c(h)}a.error("invalid interval string, please set as '2Y','2M','2D','2h','2m','2s' with their combination!")}var g={Y:"year",M:"month",D:"date",h:"hour",m:"minute",s:"second"},h=[];a.keys?h=a.keys(g):a.each(g,function(a,b){h.push(b)});var i={year:0,month:0,date:0,hour:0,minute:0,second:0};a.mix(Date,{parseBy:function(b,c){b=a.trim(b),c=a.trim(c);var d=!0,f=!0,j="Date parse failed, please check and retry!";if(b&&c){for(var k=0,l=0,m=c.length;m>k&&d;k++,l++){var n=c.charAt(k),o=b.charAt(l);if(a.inArray(n,h))if("YYYY"==c.substr(k,4)){var p=parseInt(b.substr(l,4));if(!isNaN(p)){i.year=p,k+=3,l+=3;continue}d=!1}else if(n==c.charAt(k+1)){var q=parseInt(b.substr(l,2));if(!(isNaN(q)||0>q)){i[g[n]]=q,("0"==b[l]||q>=10)&&l++,k++;continue}d=!1}if(!d||n!=o)return a.log(j),!1}return f=e(i),f||a.log(j),f}return a.log(j),!1}}),a.mix(Date.prototype,{isLeapYear:function(){return d(this.getFullYear())},before:function(a){return f(this,a,!1)},after:function(a){return f(this,a,!0)},formatAs:function(c){function d(a){return 10>a?"0"+a:a}var e=arguments[1]||!1,f=b(this);return e&&a.each(f,function(a,b){f[b]=d(a)}),c.replace("YYYY",f.year).replace("MM",f.month).replace("DD",f.date).replace("hh",f.hour).replace("mm",f.minute).replace("ss",f.second)}})});