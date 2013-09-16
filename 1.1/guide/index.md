## 综述

RichDate是基于Kissy的对Date对象及原型进行增强的工具组件，方便对时间的操作。

* 版本：1.1
* 作者：hongshu<tiehang.lth@taobao.com>
* demo：[http://gallery.kissyui.com/RichDate/1.0/demo/index.html](http://gallery.kissyui.com/RichDate/1.0/demo/index.html)


## 约定
#### 时间格式字符串（用在parseBy和formatAs中）
按照通用的时间字符来表示： 'YYYY-MM-DD hh:mm:ss'分别表示年、月、日、时、分、秒

#### 时间间隔格式字符串（用在before和after中）
与上面类似，Y、M、D、h、m、s分别表示年、月、日、时、分、秒
e.g：表示2年3个月15天8小时42分36秒：'2Y3M15D8h42m36s'

## 初始化组件

    S.use('gallery/RichDate/1.0/index', function (S, RichDate) {
         // 无需初始化，加载时自动完成Date的扩展
    })

## API说明

* parseBy: function(string, pattern, isForceLeadingZero)
    * 根据指定的pattern对时间字符串string进行解析，返回构造的时间对象
    * 当解析不成功时返回false，所以也可以用来判断用户提交的时间字符串是否是按照要求的格式输入
    * isForceLeadingZero：指定是否强制要求string中数字包含前导零
    * 调用方式：Date.parseBy(string, pattern, isForceLeadingZero)


        var a = Date.parseBy('2013年09月05日 01:02:17', 'YYYY年MM月DD日 hh:mm:ss', true);
        // a.toLocaleString() = "2013年9月5日 上午1:02:17"

        var a = Date.parseBy('2013年9月5日 1:2:17', 'YYYY年MM月DD日 hh:mm:ss');
        // a = false

        var a = Date.parseBy('2013年9月5日 1:2:17', 'YYYY年MM月DD日 hh:mm:ss', false);
        // a.toLocaleString() = "2013年9月5日 上午1:02:17"
    
* formatAs: function(pattern/\*, isLeadingZero\*/)
    * 根据指定的pattern对date对象进行格式化输出，返回输出的字符串
    * 备注：isLeadingZero为可选参数，表示是否输出前导零，默认不输出（对时分秒始终输出前导零）
    * 调用方式：dateObj.formatAs(pattern)

        var a = new Date(2013, 8, 16);

        var b = a.formatAs('YYYY年MM月DD日');
        // b = '2013年9月16日'

        var c = a.formatAs('YYYY年MM月DD日', true);
        // c = '2013年09月16日'

* before: function(interval)
    * 根据指定的时间间隔字符串interval计算之前的某个时间点，比如'2Y2M'，2年2个月前，返回对应的时间点date对象
    * 调用方式：dateObj.before(interval)

        var a = new Date(2013, 8, 16, 10, 10, 10);

        var b = a.before('4Y 3M 2D 1h 2m');
        // b.formatAs('YYYY年MM月DD日 hh:mm:ss') = '2009年6月14日 09:08:10'


* after: function(interval)
    * 与before对应，计算将来的某个时间点
    * 调用方式：dateObj.after(interval)

        var a = new Date(2013, 8, 16, 10, 10, 10);

        var b = a.after('4Y 3M 2D 1h 2m');
        // b.formatAs('YYYY年MM月DD日 hh:mm:ss') = '2017年12月18日 11:12:10'

* isLeapYear: function()
    * 校验当前date对象是否为闰年，返回boolean
    * 调用方式：dateObj.isLeapYear()
