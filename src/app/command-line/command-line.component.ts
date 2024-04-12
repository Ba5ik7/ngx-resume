import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgZone, inject } from '@angular/core';

@Component({
  selector: 'app-command-line',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './command-line.component.html' ,
  styleUrl: './command-line.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommandLineComponent {
  zone = inject(NgZone);
  ngOnInit(): void {
    setTimeout(() => {
        this.init();
    }, 2000);

  }

  init() {
    var koef = 1;
    var canvas = document.getElementById('heart')! as HTMLCanvasElement;
    var ctx = canvas.getContext('2d')!;
    var width = (canvas.width = koef * innerWidth) + 350;
    var height = (canvas.height = koef * innerHeight) - 350;
    var rand = Math.random;
    // ctx.fillStyle = 'rgba(0, 0, 0, 0)';
    // ctx.fillRect(0, 0, width, height);

    var myTimer: any;

    window.addEventListener('resize', function () {
      width = canvas.width = koef * innerWidth;
      height = canvas.height = koef * innerHeight;

      // ctx.fillRect(0, 0, width, height);
    });

    var traceCount = 180;
    var pointsOrigin: number[][] = [];
    var i;
    var dr = 0.1;
    for (i = 0; i < Math.PI * 2; i += dr)
      pointsOrigin.push(this.scaleAndTranslate(this.heartPosition(i), 210, 13, 0, 0));
    for (i = 0; i < Math.PI * 2; i += dr)
      pointsOrigin.push(this.scaleAndTranslate(this.heartPosition(i), 150, 9, 0, 0));
    for (i = 0; i < Math.PI * 2; i += dr)
      pointsOrigin.push(this.scaleAndTranslate(this.heartPosition(i), 90, 5, 0, 0));
    var heartPointsCount = pointsOrigin.length;

    var targetPoints: number[][] = [];
    var pulse = function (kx: number, ky: number) {
      for (i = 0; i < pointsOrigin.length; i++) {
        targetPoints[i] = [];
        targetPoints[i][0] = kx * pointsOrigin[i][0] + xPos;
        targetPoints[i][1] = ky * pointsOrigin[i][1] + yPos;
      }
    };

    var e: string | any[] = [];

    var config = {
      traceK: 0.9,
      timeDelta: 0.01,
    };

    var time = 0;
    var loop = () => {
      var n = -Math.cos(time);
      pulse((1 + n) * 0.5, (1 + n) * 0.5);
      time += (Math.sin(time) < 0 ? 9 : n > 0.8 ? 0.2 : 1) * config.timeDelta;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (i = e.length; i--; ) {
        var u = e[i];
        var q = targetPoints[u.q];
        var dx = u.trace[0].x - q[0];
        var dy = u.trace[0].y - q[1];
        var length = Math.sqrt(dx * dx + dy * dy);
        if (10 > length) {
          if (0.95 < rand()) {
            u.q = ~~(rand() * heartPointsCount);
          } else {
            if (0.99 < rand()) {
              u.D *= -1;
            }
            u.q += u.D;
            u.q %= heartPointsCount;
            if (0 > u.q) {
              u.q += heartPointsCount;
            }
          }
        }
        u.vx += (-dx / length) * u.speed;
        u.vy += (-dy / length) * u.speed;
        u.trace[0].x += u.vx;
        u.trace[0].y += u.vy;
        u.vx *= u.force;
        u.vy *= u.force;
        for (k = 0; k < u.trace.length - 1; ) {
          var T = u.trace[k];
          var N = u.trace[++k];
          N.x -= config.traceK * (N.x - T.x);
          N.y -= config.traceK * (N.y - T.y);
        }
        ctx.fillStyle = u.f;
        for (k = 0; k < u.trace.length; k++) {
          ctx.fillRect(u.trace[k].x, u.trace[k].y, 1, 1);
        }
      }
      // ctx.fillStyle = 'rgba(0,0,0,1)';
      // ctx.fillRect(u.trace[k].x, u.trace[k].y, 1, 1);
      // for (i = u.trace.length; i--;) ctx.fillRect(targetPoints[i][0], targetPoints[i][1], 2, 2);

      this.zone.runOutsideAngular(() => {
        window.requestAnimationFrame(loop);
      });
    };

    var xPos = width * 0.5;
    var yPos = height * 0.5;
    var timeX = 8000;
    // var ramBGColor: string;
    var ramSpeed = .2;
    // var countReset = 0;
    // var resetBG = true;

    for (i = 0; i < heartPointsCount; i++) {
      var x = rand() * width;
      var y = rand() * height;
      e[i] = {
        vx: 0,
        vy: 0,
        R: 2,
        speed: .4,
        q: ~~(rand() * heartPointsCount),
        D: 2 * (i % 2) - 1,
        force: 0.2 * rand() + 0.7,
        f:
          'hsla(0,' +
          ~~(40 * rand() + 60) +
          '%,' +
          ~~(60 * rand() + 20) +
          '%,.3)',
        trace: [],
      };
      for (var k = 0; k < traceCount; k++) e[i].trace[k] = { x: x, y: y };
    }

    var resetTime = () => {
      myTimer = setInterval(() => {
        // ++countReset;
        // if (countReset > 3) {
        //   var tempNumC = this.getRandomInt(214, 314);
        //   ramBGColor =
        //     'hsla(' +
        //     ~~tempNumC +
        //     ',' +
        //     ~~(35 * rand() + 65) +
        //     '%,' +
        //     ~~(10 * rand() + 15) +
        //     '%,.1)';
        //   countReset = 0;
        //   resetBG = !resetBG;
        //   console.log(resetBG);
        // }
        xPos = width * this.getRandomArbitary(0.2, 0.8);
        yPos = height * this.getRandomArbitary(0.2, 0.8);
        
        // traceCount = this.getRandomInt(300, 500);
        ramSpeed = this.getRandomInt(.1, 10);
        
        var ramShapeColor = this.getRandomInt(0, 360);
        for (i = 0; i < heartPointsCount; i++) {
          e[i].speed = ramSpeed;
          e[i].f =
            'hsla(' +
            ~~ramShapeColor +
            ',' +
            ~~(40 * rand() + 60) +
            '%,' +
            ~~(60 * rand() + 20) +
            '%,.1)';
          //e[i].f = "hsla(" + ~~(getRandomInt(76, 141)) + "," + ~~(40 * rand() + 60) + "%," + ~~(60 * rand() + 20) + "%,.3)"
        }
        // timeX = this.getRandomInt(2000, 10000);
        clearInterval(myTimer);
        resetTime();
      }, 10000);
    }
    resetTime();
    loop();
  }

  scaleAndTranslate(pos: number[], sx: number, sy: number, dx: number, dy: number) {
    // return [200*(dx + Math.sin(sx * pos[0])), 200*(dy + Math.cos(sy * pos[1]))];
    // return [(dx + pos[0] * sx), 15*(dy + pos[1] * sy)];
    return [dx + pos[0] * sx, dy + pos[1] * sy];
  };

  heartPosition(rad: number) {
    // return [Math.cos(3 * rad) * Math.sin(rad), -(Math.cos(3 * rad) * Math.cos(rad))];
    return [
      Math.pow(Math.sin(rad), 3),
      -(
        15 * Math.cos(rad) -
        5 * Math.cos(2 * rad) -
        2 * Math.cos(3 * rad) -
        Math.cos(4 * rad)
      ),
    ];
  };


  getRandomArbitary(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
