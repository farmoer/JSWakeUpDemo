/**
*   使用方法：
*    1.先配置一个对象config,如var config{
*                     iphoneSchema: iosscheme,
*                     iphoneDownUrl: iphoneDownUrl,
*                     androidSchema: androidSchema,
*                     androidDownUrl: androidDownUrl,
*                     params: params
*                     }
*   调用wakeup(config)函数
*

**
*
*/
    var ua = navigator.userAgent.toLowerCase(),
        locked = false,
        domLoaded = document.readyState==='complete',
        delayToRun;

    function customClickEvent() {
        var clickEvt;
        if (window.CustomEvent) {
            clickEvt = new window.CustomEvent('click', {
                canBubble: true,
                cancelable: true
            });
        } else {
            clickEvt = document.createEvent('Event');
            clickEvt.initEvent('click', true, true);
        }

        return clickEvt;
    }
    var isiOS = /(iphone|ipod|ipad);?/i.test(ua);
    var noIntentTest = /aliapp|360 aphone|weibo|windvane|ucbrowser|baidubrowser/.test(ua);
    var hasIntentTest = /chrome|samsung/.test(ua);
    var isAndroid = /android|adr/.test(ua) && !(/windows phone/.test(ua));
    var canIntent = !noIntentTest && hasIntentTest && isAndroid;
    var openInIfr = /weibo|m353/.test(ua);
    var inWeibo = ua.indexOf('weibo')>-1;
    var iOS9SafariFix=false;
    if (ua.indexOf('m353')>-1 && !noIntentTest) {
        canIntent = false;
    }
    //iOS >= 9.0且是Safari，需要用a标签
    if (isiOS && /safari/i.test(ua)) {
        iOS_version = ua.match(/version\/([\d\.]+)/i);
        if (iOS_version && iOS_version.length == 2) {
            iOS_version = +iOS_version[1];
            if (iOS_version >= 9) {
                iOS9SafariFix = true;
            }
        }
    }
    /**
     * 打开app
     * @param   {object}    options  唤起app的参数设置
     * @param    options.iphoneSchema ios scheme,
     *@param    .options.iphoneDownUrl  ios 如果没有装app跳到url下载,
     *@param   .options.androidSchema  安卓scheme,
     *@param    options.androidDownUrl android 如果没有装app跳到url下载,
     *@param    options.params 地址后面所接参数；
     *
     */
    function wakeup(options) {
        if (!domLoaded && (ua.indexOf('360 aphone')>-1 || canIntent)) {
            var arg = arguments;
            delayToRun = function () {
                wakeup.apply(null, arg);
                delayToRun = null;
            };
            return;
        }

        // 唤起锁定，避免重复唤起
        if (locked) {
            return;
        }
        locked = true;


        var options=options||{};

        var o;
        // 参数容错
        if (typeof options==='object') {
            o = options;
        } else {
            o = {
                iphoneSchema: iphoneSchema,
                iphoneDownUrl: iphoneDownUrl,
                androidSchema: androidSchema,
                androidDownUrl: androidDownUrl,
                params: params

            };
        }

        // 参数容错
        if (typeof o.params !== 'string') {
            o.params = '';
        }

        // o.params = o.params || 'appId=20000001';
        // o.params = o.params + '';
        // o.params = o.params + '&_t=' + (new Date()-0);
        //
        // if (o.params.indexOf('startapp?')>-1) {
        //     o.params = o.params.split('startapp?')[1];
        // } else if (o.params.indexOf('startApp?')>-1) {
        //     o.params = o.params.split('startApp?')[1];
        // }

        // 通过alipays协议唤起app
        var schemePrefix;    //scheme前缀
        var jumpurl;
        alert(ua);
        console.log(canIntent);
        if (!canIntent) {
            schemePrefix=o.iphoneSchema;
            jumpurl=o.iphoneDownUrl;
            var iosScheme = schemePrefix  + o.params;
            alert("ios::"+iosScheme);
            alert("下载地址："+jumpurl);
            if ( ua.indexOf('qq/') > -1 ||iOS9SafariFix|| ( ua.indexOf('safari') > -1 && ua.indexOf('os 9_') > -1 ) ) {
                var openSchemeLink = document.getElementById('openSchemeLink');
                if (!openSchemeLink) {
                    openSchemeLink = document.createElement('a');
                    openSchemeLink.id = 'openSchemeLink';
                    openSchemeLink.style.display = 'none';
                    document.body.appendChild(openSchemeLink);
                }
                openSchemeLink.href = iosScheme;
                // 执行click
                openSchemeLink.dispatchEvent(customClickEvent());
            } else {
                var ifr = document.createElement('iframe');
                ifr.src = iosScheme;
                ifr.style.display = 'none';
                document.body.appendChild(ifr);
            }
        } else {
            // android 下 chrome 浏览器通过 intent 协议唤起app
            schemePrefix=o.androidSchema;
            jumpurl=o.androidDownUrl;
            alert("安卓："+schemePrefix);
            alert("地址："+jumpurl);
            var andoridScheme = schemePrefix  + o.params;
            alert(andoridScheme);
            var openIntentLink = document.getElementById('openIntentLink');
            if (!openIntentLink) {
                openIntentLink = document.createElement('a');
                openIntentLink.id = 'openIntentLink';
                openIntentLink.style.display = 'none';
                document.body.appendChild(openIntentLink);
            }
            openIntentLink.href = andoridScheme;
            // 执行click
            openIntentLink.dispatchEvent(customClickEvent());
        }
        console.log(schemePrefix);
        console.log(jumpurl);
        // 延迟移除用来唤起钱包的IFRAME并跳转到下载页
        setTimeout(function () {
          console.log(jumpUrl);
          if (jumpUrl) {
              location.href = jumpUrl;
           }


        }, 1000)


        // 唤起加锁，避免短时间内被重复唤起
        setTimeout(function () {
            locked = false;
        }, 2500)
    }

    if (!domLoaded) {
        document.addEventListener('DOMContentLoaded', function () {
            domLoaded = true;
            if (typeof delayToRun === 'function') {
                delayToRun();
            }
        }, false);
    }
