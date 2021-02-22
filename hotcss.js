(function (window, document) {
  'use strict';

  //给hotcss开辟个命名空间，别问我为什么，我要给你准备你会用到的方法，免得用到的时候还要自己写。
  var hotcss = {};

  (function () {
    //根据devicePixelRatio自定计算scale
    //可以有效解决移动端1px这个世纪难题。
    var viewportEl = document.querySelector('meta[name="viewport"]'),
      hotcssEl = document.querySelector('meta[name="hotcss"]'),
      dpr = window.devicePixelRatio || 1,
      maxWidth = 750,
      designWidth = 750;

    dpr = dpr >= 3 ? 3 : dpr >= 2 ? 2 : 1;

    //允许通过自定义name为hotcss的meta头，通过initial-dpr来强制定义页面缩放
    if (hotcssEl) {
      var hotcssCon = hotcssEl.getAttribute('content');
      if (hotcssCon) {
        var initialDprMatch = hotcssCon.match(/initial\-dpr=([\d\.]+)/);
        if (initialDprMatch) {
          dpr = parseFloat(initialDprMatch[1]);
        }
        var maxWidthMatch = hotcssCon.match(/max\-width=([\d\.]+)/);
        if (maxWidthMatch) {
          maxWidth = parseFloat(maxWidthMatch[1]);
        }
        var designWidthMatch = hotcssCon.match(/design\-width=([\d\.]+)/);
        if (designWidthMatch) {
          designWidth = parseFloat(designWidthMatch[1]);
        }
      }
    }

    document.documentElement.setAttribute('data-dpr', dpr);
    hotcss.dpr = dpr;

    document.documentElement.setAttribute('max-width', maxWidth);
    hotcss.maxWidth = maxWidth;

    if (designWidth) {
      document.documentElement.setAttribute('design-width', designWidth);
    }
    hotcss.designWidth = designWidth; // 保证px2rem 和 rem2px 不传第二个参数时, 获取hotcss.designWidth是undefined导致的NaN
  })();

  hotcss.mresize = function () {
    //对，这个就是核心方法了，给HTML设置font-size。
    var innerWidth =
      document.documentElement.getBoundingClientRect().width ||
      window.innerWidth;

    if (!innerWidth) {
      return false;
    }
    document.documentElement.style.fontSize = (innerWidth * 50) / 375 + 'px';

    hotcss.callback && hotcss.callback();
  };

  hotcss.mresize();
  //直接调用一次

  window.addEventListener(
    'resize',
    function () {
      clearTimeout(hotcss.tid);
      hotcss.tid = setTimeout(hotcss.mresize, 33);
    },
    false
  );
  //绑定resize的时候调用

  window.addEventListener('load', hotcss.mresize, false);
  //防止不明原因的bug。load之后再调用一次。

  setTimeout(function () {
    hotcss.mresize();
    //防止某些机型怪异现象，异步再调用一次
  }, 333);

  window.hotcss = hotcss;
  //命名空间暴露给你，控制权交给你，想怎么调怎么调。
})(window, document);
