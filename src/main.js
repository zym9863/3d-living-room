// 导入Three.js及其组件
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

// 全局变量
let scene, camera, renderer, controls;
let livingRoom, mixer;
let clock = new THREE.Clock();
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let selectedObject = null;
let tooltip = null;
let animations = [];
let lights = {};

// 初始化场景
function init() {
    // 创建场景
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f0); // 米白色背景
    
    // 创建相机
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 1.6, 5);
    
    // 创建渲染器
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.getElementById('container').appendChild(renderer.domElement);
    
    // 创建控制器
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 2;
    controls.maxDistance = 10;
    controls.maxPolarAngle = Math.PI / 2;
    
    // 添加灯光
    addLights();
    
    // 加载模型
    loadModel();
    
    // 创建提示框
    createTooltip();
    
    // 添加事件监听器
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onMouseClick);
    
    // 开始动画循环
    animate();
}

// 添加灯光
function addLights() {
    // 环境光
    lights.ambient = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(lights.ambient);
    
    // 主光源 - 模拟窗户光线
    lights.main = new THREE.DirectionalLight(0xffffff, 0.8);
    lights.main.position.set(5, 5, 5);
    lights.main.castShadow = true;
    lights.main.shadow.mapSize.width = 2048;
    lights.main.shadow.mapSize.height = 2048;
    scene.add(lights.main);
    
    // 补光
    lights.fill = new THREE.DirectionalLight(0xffffff, 0.3);
    lights.fill.position.set(-5, 3, -5);
    scene.add(lights.fill);
    
    // 装饰灯光 - 可以用于动态效果
    lights.spot1 = new THREE.SpotLight(0xd4af37, 0.8); // 香槟金色灯光
    lights.spot1.position.set(0, 3, 0);
    lights.spot1.angle = Math.PI / 6;
    lights.spot1.penumbra = 0.3; // 增加柔和度
    lights.spot1.castShadow = true;
    lights.spot1.visible = false; // 默认关闭，可以通过交互打开
    scene.add(lights.spot1);
}

// 加载模型
function loadModel() {
    const loadingManager = new THREE.LoadingManager();
    loadingManager.onProgress = function(item, loaded, total) {
        console.log(item, loaded, total);
    };
    
    loadingManager.onLoad = function() {
        document.getElementById('loading').style.display = 'none';
    };
    
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.160.0/examples/js/libs/draco/');
    
    const loader = new GLTFLoader(loadingManager);
    loader.setDRACOLoader(dracoLoader);
    
    // 添加更多的错误处理和日志
    console.log('开始加载模型: scene.glb');
    loadingManager.onError = function(url) {
        console.error('加载资源出错:', url);
        document.getElementById('loading').innerHTML = `<div class="loading-text">加载失败，请刷新页面重试</div>`;
    };
    
    // 使用相对路径加载模型，并添加详细日志
    console.log('尝试加载模型文件: scene.glb');
    loader.load('./public/scene.glb', function(gltf) {
        console.log('模型加载成功!');
        livingRoom = gltf.scene;
        
        // 设置阴影
        livingRoom.traverse(function(child) {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                
                // 为可交互物体添加自定义属性
                if (isInteractiveObject(child)) {
                    child.userData.interactive = true;
                    child.userData.description = getObjectDescription(child.name);
                }
            }
        });
        
        // 调整模型位置和比例
        livingRoom.scale.set(1, 1, 1);
        livingRoom.position.set(0, 0, 0);
        scene.add(livingRoom);
        
        // 处理动画
        if (gltf.animations && gltf.animations.length) {
            mixer = new THREE.AnimationMixer(livingRoom);
            gltf.animations.forEach(clip => {
                animations.push(mixer.clipAction(clip));
            });
            
            // 可以在这里播放特定动画
            // animations[0].play();
        }
        
        // 调整相机位置以适应模型
        fitCameraToObject(livingRoom);
    }, function(xhr) {
        // 添加加载进度显示
        console.log('模型加载进度: ' + (xhr.loaded / xhr.total * 100) + '%');
        document.getElementById('loading').innerHTML = `
            <div class="spinner"></div>
            <div class="loading-text">加载中: ${Math.floor(xhr.loaded / xhr.total * 100)}%</div>
        `;
    }, function(error) {
        console.error('加载模型时出错:', error);
        document.getElementById('loading').innerHTML = `
            <div class="loading-text">加载失败: ${error.message || '未知错误'}</div>
            <div class="loading-text">请检查模型文件是否存在或刷新页面重试</div>
        `;
    });
    
    // 添加超时处理
    setTimeout(function() {
        if(document.getElementById('loading').style.display !== 'none') {
            console.warn('模型加载超时');
            document.getElementById('loading').innerHTML = `
                <div class="loading-text">加载超时，请检查模型文件或网络连接</div>
                <button onclick="location.reload()">刷新页面</button>
            `;
        }
    }, 30000); // 30秒超时
}

// 判断物体是否可交互
function isInteractiveObject(object) {
    // 根据命名规则或其他特征判断物体是否可交互
    const interactiveNames = ['sofa', 'table', 'chair', 'lamp', 'tv', 'cabinet', 'bookshelf'];
    for (const name of interactiveNames) {
        if (object.name.toLowerCase().includes(name)) {
            return true;
        }
    }
    return false;
}

// 获取物体描述
function getObjectDescription(name) {
    // 根据物体名称返回描述信息
    const descriptions = {
        'sofa': '舒适的沙发，适合休闲放松',
        'table': '实用的桌子，可用于放置物品或用餐',
        'chair': '精心设计的椅子，提供良好的坐姿支持',
        'lamp': '温暖的灯光，可以调节亮度',
        'tv': '高清电视，支持智能功能',
        'cabinet': '储物柜，可以存放各种物品',
        'bookshelf': '书架，用于摆放书籍和装饰品'
    };
    
    for (const key in descriptions) {
        if (name.toLowerCase().includes(key)) {
            return descriptions[key];
        }
    }
    
    return '未知物体';
}

// 创建提示框
function createTooltip() {
    tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.style.display = 'none';
    document.body.appendChild(tooltip);
}

// 窗口大小调整处理
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// 鼠标移动处理
function onMouseMove(event) {
    // 计算鼠标在归一化设备坐标中的位置
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // 高亮处理
    highlightObjects();
    
    // 更新提示框位置
    if (selectedObject) {
        tooltip.style.left = event.clientX + 10 + 'px';
        tooltip.style.top = event.clientY + 10 + 'px';
    }
}

// 鼠标点击处理
function onMouseClick() {
    if (selectedObject) {
        // 显示物体信息
        document.getElementById('object-info').textContent = selectedObject.userData.description || '未知物体';
        
        // 如果是灯光，可以切换开关
        if (selectedObject.name.toLowerCase().includes('lamp')) {
            toggleLight();
        }
    } else {
        document.getElementById('object-info').textContent = '点击物体查看信息';
    }
}

// 高亮物体
function highlightObjects() {
    // 重置之前的高亮
    if (selectedObject) {
        selectedObject.material.emissive.setHex(selectedObject.currentHex);
        selectedObject = null;
        tooltip.style.display = 'none';
    }
    
    // 射线检测
    raycaster.setFromCamera(mouse, camera);
    
    // 检查与可交互物体的交叉
    if (livingRoom) {
        const intersects = raycaster.intersectObjects(livingRoom.children, true);
        
        if (intersects.length > 0) {
            let object = intersects[0].object;
            
            // 向上遍历找到有userData.interactive属性的父对象
            while (object && !object.userData.interactive) {
                object = object.parent;
            }
            
            if (object && object.userData.interactive) {
                selectedObject = object;
                selectedObject.currentHex = selectedObject.material.emissive.getHex();
                selectedObject.material.emissive.setHex(0xd4af37); // 香槟金色高亮
                
                // 显示提示框
                tooltip.textContent = selectedObject.userData.description || '未知物体';
                tooltip.style.display = 'block';
                
                // 添加平滑过渡动画
                tooltip.style.opacity = '0';
                setTimeout(() => {
                    tooltip.style.opacity = '1';
                }, 50);
            }
        }
    }
}

// 切换灯光
function toggleLight() {
    lights.spot1.visible = !lights.spot1.visible;
}

// 调整相机以适应物体
function fitCameraToObject(object) {
    const boundingBox = new THREE.Box3();
    boundingBox.setFromObject(object);
    
    const center = boundingBox.getCenter(new THREE.Vector3());
    const size = boundingBox.getSize(new THREE.Vector3());
    
    // 调整相机位置
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);
    let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
    
    // 设置一个合适的距离
    cameraZ *= 1.5;
    
    camera.position.set(center.x, center.y + size.y / 4, center.z + cameraZ);
    
    // 更新控制器目标点
    controls.target.set(center.x, center.y, center.z);
    controls.update();
}

// 动画循环
function animate() {
    requestAnimationFrame(animate);
    
    // 更新控制器
    controls.update();
    
    // 更新动画混合器
    if (mixer) {
        mixer.update(clock.getDelta());
    }
    
    // 渲染场景
    renderer.render(scene, camera);
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', init);