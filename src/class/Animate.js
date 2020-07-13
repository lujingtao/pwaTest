//动画类
export default class Animate {
  constructor() {

  }

  start( cur, point, skill, map, callBack) {
    //行为动画结束后回调，动画执行期间覆盖遮罩层，使用户不能操作
    let $animateMask = document.getElementById("animateMask");
    $animateMask.style.display = "block";

    switch (skill.id) {
      case -1: //移动
        this.moveTo(cur, point, map, callBack)
        break;
      case 99: //待机
        this.end(cur, point, map, callBack)
        break;
      case 18: //下盾
        this.shield(cur, "down", callBack)
        break;
      case 17: //架盾
        this.shield(cur, "up", callBack)
        break;
      case 13: //旋风斩
        this.whirlwind(cur, point, map, callBack)
        break;
      case 9: //钩击
        this.attack(cur, point, map, callBack)
        break;
      case 6: //推击
        this.attack(cur, point, map, callBack)
        break;
      default: //攻击
        this.attack(cur, point, map, callBack)
        break;
    }

  }

  //旋风斩
  whirlwind(cur, point, map, callBack) {
    let time = 500;
    let $cur = document.getElementById(cur.id);
    $cur.style.transition = time + "ms";
    $cur.style.transform = `rotate(350deg)`;
    setTimeout(() => {
      $cur.style.transition = "0ms";
      $cur.style.transform = ``;
      callBack()
    }, time)
  }

  //结束
  end(cur, point, map, callBack) {
    let time = 500;
    setTimeout(() => { callBack() }, time)
  }

  //移动
  moveTo(cur, point, map, callBack) {
    console.log(point);
    let time = 500;
    let $cur = document.getElementById(cur.id);
    $cur.style.transition = time + "ms";
    $cur.style.left = `${point[0]*map.unitSize}px`;
    $cur.style.top = `${point[1]*map.unitSize}px`;
    setTimeout(() => { callBack() }, time)
  }

  //架盾\下盾
  shield(cur, type, callBack) {
    let time = 500;
    let $cur = document.getElementById(cur.id);
    let $rightHand = $cur.querySelector(".rightHand");
    let dis = type == "up" ? -10 : 0;
    $rightHand.style.transition = time + "ms";
    $rightHand.style.transform = `translate3d(0,${dis}px,0)`;
    setTimeout(() => { callBack() }, time)
  }

  //攻击
  attack(cur, point, map, callBack) {
    let time = 250;
    let $cur = document.getElementById(cur.id);
    $cur.style.transition = time + "ms";
    $cur.style.left = `${point[0]*map.unitSize}px`;
    $cur.style.top = `${point[1]*map.unitSize}px`;
    setTimeout(() => {
      $cur.style.left = `${cur.x*map.unitSize}px`;
      $cur.style.top = `${cur.y*map.unitSize}px`;
      setTimeout(callBack, time);
    }, time)
  }

  //被攻击
  attacked(cur, tar, map, result, callBack) {
    let $tar = document.getElementById(tar.id);
    let $txt = $tar.querySelector(".stateDes");
    let txt = "";
    let txtTime = 800;
    if (result.type == 0) { //闪避，左右摇摆
      txt = "MISS";
      let time = 50;
      $tar.style.transition = time + "ms";
      $tar.style.transform = `translate3d(-10px,0,0)`;
      setTimeout(() => {
        $tar.style.transform = `translate3d(10px,0,0)`;
        setTimeout(() => {
          $tar.style.transform = ``;
        }, time)
      }, time * 2)
    } else { //被伤害
      if (result.position == "rightHand") { //如果攻击盾牌
        txt = "-" + result.equipDamage + "盾";
        let $rightHand = $tar.querySelector(".rightHand");
        let _transform = $rightHand.style.transform; //默认盾牌状态
        $rightHand.style.transition = 200 + "ms";
        $rightHand.style.transform = _transform + " scale(1.5,1.5)";

        if (tar._equips.rightHand.dur <= 0) { //如果盾牌耐久为0，则目标卸载盾牌
          setTimeout(() => {
            $rightHand.style.transform = _transform + " scale(1,0)";
            setTimeout(() => {
              tar.removeSkill(18, true);
              tar.removeEquip("rightHand");
            }, 200)
          }, 400)
        } else { //盾牌复原原始大小
          setTimeout(() => {
            $rightHand.style.transform = _transform + " scale(1,1)";
          }, 400)
        }
      } else {
        txt = "-" + result.damage + (result.position == "head" ? "！" : "");
        if (result.type == 2) { //死亡
          $tar.style.transition = 800 + "ms";
          $tar.style.opacity = 0;
          $tar.style.transform = "scale(1,0)";
        }
      }
    }
    //伤害文字上移显示
    $txt.innerText = txt;
    $txt.style.transition = txtTime + "ms";
    $txt.style.transform = `translate3d(0,-30px,0)`;
    $txt.style.opacity = 1;
    setTimeout(() => {
      $txt.style.transition = "0ms";
      $txt.style.transform = `translate3d(0,0,0)`;
      $txt.style.opacity = 0;
      callBack();
    }, txtTime)
  }
}
