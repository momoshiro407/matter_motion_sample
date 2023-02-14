import { basicMatterConfig, mousePointer } from './use_matter';
import "./style.css";

// matter.js関連のモジュール格納用
let Body, Bodies, Composite, engine, mouseConstraint;
// canvas領域のサイズ
const canvasWidth = 350;
const canvasHeight = 500;
// 物理演算canvas要素
const matterCanvas = $('.canvas')[0];
$(matterCanvas).css({ 'width': canvasWidth, 'height': canvasHeight });

$(function () {
    // matter.jsの基本設定
    ({ Body, Bodies, Composite, engine, mouseConstraint } = basicMatterConfig(matterCanvas, canvasWidth, canvasHeight));

    // 初期の基本地形を追加
    // 共通オプション
    const commonOptions = {
        friction: 0.01,
        density: 999,
        render: {
            fillStyle: 'rgb(80, 200, 120)',
        }
    };
    const ground = Bodies.rectangle(canvasWidth / 2, canvasHeight, canvasWidth, 40, { ...commonOptions, isStatic: true });
    const ceil = Bodies.rectangle(canvasWidth / 2, 0, canvasWidth, 40, { ...commonOptions, isStatic: true });
    const leftWall = Bodies.rectangle(0, canvasHeight / 2, 40, canvasHeight, { ...commonOptions, isStatic: true });
    const rightWall = Bodies.rectangle(canvasWidth, canvasHeight / 2, 40, canvasHeight, { ...commonOptions, isStatic: true });

    Composite.add(engine.world, [ground, ceil, leftWall, rightWall]);

    // デバイスの加速度センサーへのアクセス
    $('.confirm-button').on('click', () => {
        useDeviceMotion();
    });
});

$(matterCanvas).on('click', e => {
    // オブジェクトのドラッグ中は新規でオブジェクトを追加させない
    if (mouseConstraint.body) { return };
    addObject();
});

function addObject() {
    const circle = Bodies.polygon(mousePointer.x, mousePointer.y, 8, 15, {
        render: {
            fillStyle: 'rgb(250, 200, 180)',
            strokeStyle: 'rgb(250, 100, 0)',
            lineWidth: '5'
        },
        friction: 0.01,
        restitution: 0.8,
    });

    Composite.add(engine.world, circle);
};

function useDeviceMotion() {
    if (DeviceMotionEvent && DeviceMotionEvent.requestPermission) {
        // デバイスの加速度センサーへのアクセス許可を確認する必要がある
        DeviceMotionEvent.requestPermission()
            .then(state => {
                // アクセスを許可する場合のみ実行可能
                if (state === 'granted') {
                    $('.confirm-button').hide();
                    $('.info').show();
                    // 方向の計測結果を取得
                    window.addEventListener("deviceorientation", event => {
                        $('#orientation-x').text(`X: ${precision(event.beta)}`);
                        $('#orientation-y').text(`Y: ${precision(event.gamma)}`);
                        $('#orientation-z').text(`Z: ${precision(event.alpha)}`);
                    });
                }
            })
            .catch(error => console.log(error));
    } else {
        alert('このブラウザではDeviceMotionを利用できません。');
    }
}

function precision(num) {
    return num.toFixed(1);
}
