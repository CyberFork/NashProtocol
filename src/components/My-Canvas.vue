<template>
  <div id="canvas-box" >
    <canvas class="draw" id="canvas" @touchmove.prevent></canvas>
  </div>
</template>
<script>
export default {
  data() {
    return {
      onoff: false,
      oldx: 0,
      oldy: 0,
      ctx: "",
      linecolor: "",
      linw: 8,
      qiuyu: 0,
      onArr: [],
      endArr: [],
      canvas: null,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      let my_div = document.getElementById("canvas-box");
      let style = window.getComputedStyle(my_div, null);
      const { width ,height } = style

      this.canvas = document.getElementById("canvas");
      this.canvas.width = parseInt(style.width.match(/[0-9]+/g));
      this.canvas.height = parseInt(style.height.match(/[0-9]+/g));
      this.ctx = this.canvas.getContext("2d");
      //画一个黑色矩形
      this.ctx.fillStyle = "transparent";
      this.ctx.fillRect(0, 0, width, height);
      //按下标记
      this.onoff = false;
      this.oldx = 0;
      this.oldy = 0;
      //设置颜色默认为红色
      this.linecolor = "red";
      //宽度默认为8
      this.linw = 8;

      if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
        //鼠标移动事件，事件绑定
        this.canvas.addEventListener("touchstart", this.down, true);
        this.canvas.addEventListener("touchmove", this.draw , false);
        this.canvas.addEventListener("touchend", this.up, false);
      } else {
      //鼠标移动事件，事件绑定
        this.canvas.addEventListener("mousemove", this.draw, true);
        this.canvas.addEventListener("mousedown", this.down, false);
        this.canvas.addEventListener("mouseup", this.up, false);
      }
    },

     getElementLeft(element){
　　　　var actualLeft = element.offsetLeft;
　　　　var current = element.offsetParent;

　　　　while (current !== null){
　　　　　　actualLeft += current.offsetLeft;
　　　　　　current = current.offsetParent;
　　　　}

　　　　return actualLeft;
　　},

   getElementTop(element){
　　　　var actualTop = element.offsetTop;
　　　　var current = element.offsetParent;

　　　　while (current !== null){
　　　　　　actualTop += current.offsetTop;
　　　　　　current = current.offsetParent;
　　　　}

　　　　return actualTop;
　　}
,
    down(event) {
      console.log('down',event)
      if (this.hua == true) {
        this.onoff = false;
      } else {
        this.onoff = true;

        let x = event.pageX
        let y = event.pageX
        // 切换模式
        if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent) && event.targetTouches && event.targetTouches[0]) {
          const {pageX,pageY} = event.targetTouches[0]
           x = pageX;
           y = pageY
        }

        this.oldx =  x - this.getElementLeft(this.canvas)
        this.oldy = y -  this.getElementTop(this.canvas)
        
        console.log(x,y,this.getElementLeft(this.canvas),this.getElementTop(this.canvas))
      }
    },
    
    up() {
      this.onoff = false;
      this.qiuyu = 0;
      if (this.onArr.length > 0) {
        this.endArr.push(this.onArr);
        //这里是鼠标抬起的时候记录的坐标值
        // console.log(this.endArr, "this.endArr"); 
        this.onArr = [];
      }
      this.$emit("drawSeed");
      this.ctx.clearRect(0, 0, this.canvas.height, this.canvas.height);
    },
    draw(event) {
      
      if (this.onoff == true) {
        if (this.qiuyu % 6 == 0) {
        let x = event.pageX
        let y = event.pageX
        console.log('draw',x,y)
        // 切换模式
        if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent) && event.targetTouches && event.targetTouches[0]) {
          const {pageX,pageY} = event.targetTouches[0]
          x = pageX;
           y = pageY
        }
          //此处取余的目的是获取的坐标不是那么多
          var newx = x - this.getElementLeft(this.canvas)
          //getBoundingClientRect方法是边框距离浏览器的距离
          var newy = y -  this.getElementTop(this.canvas)
          // console.log(newx,newy,'000')
          this.ctx.beginPath();
          this.ctx.moveTo(this.oldx, this.oldy);
          this.ctx.lineTo(newx, newy);
          // console.log(newx);
          this.ctx.strokeStyle = this.linecolor;
          this.ctx.lineWidth = this.linw;
          this.ctx.lineCap = "round";
          this.ctx.stroke();

          this.oldx = newx;
          this.oldy = newy;
          let xy = {
            x: this.oldx,
            y: this.oldy,
          };
          this.onArr.push(xy);
        }
        this.qiuyu++;
      }
    },
  },
};
</script>

<style scoped>
.draw {
  cursor: crosshair;
}
</style>
