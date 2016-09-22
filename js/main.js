/**
 * Created by admin on 2016/9/7.
 */
//初始化游戏；
window.onload=function () {
    var canvas=document.querySelector("canvas");
    var cobj=canvas.getContext("2d");
    window.onresize=function () {
        canvas.width=document.documentElement.clientWidth;
        canvas.height=document.documentElement.clientHeight;
    }
    window.onresize();
    var runImg=document.querySelectorAll(".run");
    var jumpImg=document.querySelector(".jump");
    console.log(jumpImg)
    var hinderImg=document.querySelectorAll(".hinder");
    var gameObj=new game(canvas,cobj,runImg,jumpImg,hinderImg);
    gameObj.play();
    var stop=document.querySelector(".zanting");
    stop.onclick=function () {
        confirm()
    }

}
/*---------------------------主程序-----------------------------*/
//落地效果
function stone(cobj) {
    this.cobj=cobj;
    this.x=0;
    this.y=0;
    this.x1=20*Math.random()-10;
    this.y1=20*Math.random()-10;
    this.x2=20*Math.random()-10;
    this.y2=20*Math.random()-10;
    this.life=4;
    this.r=1;
    this.color="#fef";
    this.speedx=16*Math.random()-8;
    this.speedy=-2*Math.random()-2;
}
stone.prototype={
    draw:function(){
        var cobj=this.cobj;
        cobj.save();
        cobj.beginPath();
        cobj.fillStyle=this.color;
        cobj.translate(this.x,this.y);
        cobj.scale(this.r,this.r);
        cobj.moveTo(0,0);
        cobj.lineTo(this.x1,this.y1);
        cobj.lineTo(this.x2,this.y2);
        cobj.fill();
        cobj.restore();

    },
    update:function () {
        this.x+=this.speedx;
        this.y+=this.speedy;
        this.life-=0.2;
        this.r-=0.06;
    }
}
function makeStone(cobj,x,y,color){
    var color=color||"#fff";
    var stoneArr=[];
    for (var i=0;i<5;i++){
        var obj=new stone(cobj);
        obj.x=x;
        obj.y=y;
        obj.color=color;
        stoneArr.push(obj);
    }
    var t=setInterval(function () {
        for(var i=0;i<stoneArr.length;i++ ){
            stoneArr[i].draw();
            stoneArr[i].update();
            if(stoneArr[i].r<0||stoneArr[i].life<0){
                stoneArr.splice(i,1);
            }
        }
        if(stoneArr.length==0){
            clearInterval(t)
        }


    },50)
}

//创建人物
function person(canvas,cobj,runImg,jumpImg) {
    this.canvas=canvas;
    this.cobj=cobj;
    this.runImg = runImg;
    this.jumpImg = jumpImg;
    this.x=this.canvas.width/3;
    this.y=0;
    this.endy=345;
    this.G=8
    this.speedy=8
    this.width=100;
    this.height=180;
    this.state="runImg";
    this.status=0;
}
person.prototype={
    draw:function(){
        this.cobj.save();
        this.cobj.translate(this.x,this.y);
        this.cobj.drawImage(this[this.state][this.status],0,0,236,381,0,0,this.width,this.height)
        this.cobj.restore();
    },
    update:function(){
        if(this.y>this.endy){
            this.y=this.endy
            makeStone(this.cobj,this.x+this.width/2,this.y+this.height)
        }else if(this.y<this.endy){
            this.speedy+=this.G;
            this.y+=this.speedy;
        }
    }
}

//创建障碍物

function hinder(canvas,cobj,hinderImg){
    this.canvas=canvas;
    this.cobj=cobj;
    this.hinderImg=hinderImg;
    this.status=0;
    this.x=canvas.width;
    console.log(this.x)
    this.y=480;
    this.width=70;
    this.height=70;
}
hinder.prototype={
    draw:function () {
        this.cobj.save();
        this.cobj.translate(this.x,this.y);
        this.cobj.drawImage(this.hinderImg[this.status],0,0,60,60,0,0,this.width,this.height);
        this.cobj.restore();
    }
}



//主程序
function game(canvas,cobj,runImg,jumpImg,hinderImg){
    this.canvas=canvas;
    this.cobj=cobj;
    this.canvasW=canvas.width;
    this.canvasH=canvas.height;
    this.runImg=runImg;
    this.jumpImg=jumpImg;
    this.hinderImg=hinderImg;
    this.hinderArr=[];
    this.life=4;
    this.score=1;
    this.person=new person(canvas,cobj,runImg,jumpImg);
    this.speed=8;
    this.guanqia=1;

}
game.prototype={
    play:function(){
        var that=this;
        that.key()
        var num=0;
        var back=0;
        var num2=0;
        var step=5000+parseInt(5*Math.random())*1000;
        setInterval(function () {
            num++;
            back-=that.speed;
            that.cobj.clearRect(0,0,that.canvasW,that.canvasH)
            if(that.person.state="runImg"){
                that.person.status=num%24;
            }else if(that.person.state="jumpImg"){
                that.person.status=0;
            }
            that.person.draw();
            that.person.update();
            that.canvas.style.backgroundPositionX=back+"px";
            if(num2%step==0){
                num2=0;
                step=5000+parseInt(5*Math.random())*1000;
                var hinderObj=new hinder(that.canvas,that.cobj,that.hinderImg);
                hinderObj.status=Math.floor(that.hinderImg.length*Math.random());
                that.hinderArr.push(hinderObj);
                //     console.log(hinderObj)

                if(that.hinderArr.length>5){
                    that.hinderArr.shift();
                }
            }
            num2+=50;
            for (var i=0;i<that.hinderArr.length;i++){
                that.hinderArr[i].x-=that.speed;
                that.hinderArr[i].draw();
              if(hitPix(that.canvas,that.cobj,that.person,that.hinderArr[i])){
                  if(!that.hinderArr[i].flag1){
                      that.life--;
                      // console.log(this.life)
                 var lifes=document.querySelector('.lifes')
                      lifes.innerHTML=that.life
                      makeStone(that.cobj,that.person.x+that.person.width/2,that.person.y+that.person.height/2,"red")
                  }
                  that.hinderArr[i].flag1=true;
                  if(that.life<=0){
                      alert("Game Over!")
                      location.reload();
                  }
              }else if(that.hinderArr[i].x+that.hinderArr[i].width<that.person.x){
                  if(!that.hinderArr[i].flag&&!that.hinderArr[i].flag1){
                      var scores=document.querySelector(".scores");
                      scores.innerHTML=++that.score;

                      if(that.score%3==0){
                          that.speed+=1;
                          alert("欢迎进入下一关")
                          that.guanqia++
                          var guanqias=document.querySelector(".guanqias");
                          guanqias.innerHTML=that.guanqia
                          if(that.speed>=10){
                              that.speed=10;
                          }
                      }
                  }
                  that.hinderArr[i].flag=true;
              }
            }


        },50)
    },
    key:function () {
    var that=this;
        var flag=true;
        document.onkeydown=function (e) {
            if (!flag) {
                return;
            }
            flag = false;
            var code=e.keyCode;
            console.log(code)
            if(code==32){
                that.person.state="jumpImg";
                var initA=0;
                var speedA=10;
                var r=100;
                var inity=that.person.y;
                var t=setInterval(function () {
                    initA+=speedA;
                    if(initA>180){
                        makeStone(that.cobj,that.person.x+that.person.width/2,that.person.y+that.person.height)
                        clearInterval(t);
                        that.person.y=inity;
                        that.person.state="runImg";
                        flag=true;

                    }else{
                        var len=Math.sin(initA*Math.PI/180)*r;
                        that.person.y=inity-len;
                    }
                },50)
            }

        }
    }
}




















