<template>
  <div>
    <canvas class="draw" id="canvas" width="329.06" height="337.6"></canvas>
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
      this.canvas = document.getElementById("canvas");
      this.ctx = this.canvas.getContext("2d");
      //画一个黑色矩形
      this.ctx.fillStyle = "transparent";
      this.ctx.fillRect(0, 0, 380, 300);
      //按下标记
      this.onoff = false;
      this.oldx = 0;
      this.oldy = 0;
      //设置颜色默认为红色
      this.linecolor = "red";
      //宽度默认为8
      this.linw = 8;
      //鼠标移动事件，事件绑定
      this.canvas.addEventListener("mousemove", this.draw, true);
      this.canvas.addEventListener("mousedown", this.down, false);
      this.canvas.addEventListener("mouseup", this.up, false);
    },

    down(event) {
      if (this.hua == true) {
        this.onoff = false;
      } else {
        this.onoff = true;
        this.oldx = event.pageX - this.canvas.getBoundingClientRect().left;
        this.oldy = event.pageY - this.canvas.getBoundingClientRect().top;
        // console.log(this.oldx,this.oldy,'event')
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
      this.ctx.clearRect(0, 0, 380, 300);
    },
    draw(event) {
      if (this.onoff == true) {
        if (this.qiuyu % 6 == 0) {
          //此处取余的目的是获取的坐标不是那么多
          var newx = event.pageX - this.canvas.getBoundingClientRect().left;
          //getBoundingClientRect方法是边框距离浏览器的距离
          var newy = event.pageY - this.canvas.getBoundingClientRect().top;
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
