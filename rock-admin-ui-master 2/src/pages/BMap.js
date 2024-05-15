// bmp.js
export function BMPGL() {
    return new Promise(function(resolve, reject) {
      window.init = function() {
        // eslint-disable-next-line
        resolve(BMapGL)
      }
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = `http://api.map.baidu.com/api?v=1.0&type=webgl&ak=DajmAkac8Zt91BgscV2mUgTWsHkzXZqt&callback=init`
      script.onerror = reject
      document.head.appendChild(script)
    })
  }
  