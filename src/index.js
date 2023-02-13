import { basicMatterConfig, mousePointer } from './use_matter';
import "./style.css";

// matter.js関連のモジュール格納用
let Body, Bodies, Composite, engine, mouseConstraint;
// canvas領域のサイズ
const canvasWidth = 350;
const canvasHeight = 500;
// 物理演算canvas要素
const matterCanvas = $('#canvas')[0];

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
});

$(matterCanvas).on('click', () => {
    // オブジェクトのドラッグ中は新規でオブジェクトを追加させない
    if (mouseConstraint.body) { return };
    addObject();
});

const addObject = () => {
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
