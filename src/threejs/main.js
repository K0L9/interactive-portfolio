import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { Point } from "./point";
import { CSS2DRenderer } from "three/addons/renderers/CSS2DRenderer.js";

let instance = null;

export default class MyScene {
  static getInstance(navigateFunc, changeFocusState) {
    if (!instance) {
      instance = new MyScene(navigateFunc, changeFocusState, true); // The second parameter is a private flag
    } else {
      instance.unfreeze();
    }

    return instance;
  }

  constructor(navigateFunc, changeFocusState, isSingleton) {
    if (!isSingleton) {
      throw new Error("Use MyScene.getInstance() instead of new MyScene().");
    }

    const scene = new THREE.Scene();
    this.scene = scene;
    this.scene.background = new THREE.Color("skyblue");

    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.defaultCameraPosition = new THREE.Vector3(10, 10, 10);
    this.defaultCameraLookAt = new THREE.Vector3(0, 0, 0);
    this.camera.position.copy(this.defaultCameraPosition);
    this.camera.lookAt(this.defaultCameraLookAt);

    const canvas = document.querySelector("#webgl");
    this.renderer = new THREE.WebGLRenderer({ canvas: canvas });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    // this.renderer.document.body.appendChild(this.renderer.domElement);

    this.textRenderer();

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    const loader = new GLTFLoader();
    const mixer = new THREE.AnimationMixer();
    this.mixer = mixer;

    loader.load("\\src\\assets\\medieval_fantasy_book.glb", function (glb) {
      const model = glb.scene;
      model.position.set(0, 0, 0);
      model.scale.set(0.3, 0.3, 0.3);
      scene.add(model);

      let action = mixer.clipAction(glb.animations[0], model);
      action.play();
    });

    this.setLights();

    this.setPoints();

    this.onWindowResize = this.onWindowResize.bind(this);
    this.boundOnButtonClick = this.onButtonClick.bind(this);
    this.boundRender = this.render.bind(this);
    this.mouseClickBounder = this.onMeshMouseClick.bind(this);
    this.mouseUpBounder = this.onMeshMouseUp.bind(this);

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.setEvents();

    this.currFocusIndex = -1;
    this.currFocusPoint = null;
    this.isFocused = false;

    this.navigate = navigateFunc;
    this.changeFocusState = changeFocusState;

    this.animate();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
    this.labelRenderer.render(this.scene, this.camera);
  }

  setEvents() {
    window.addEventListener("resize", this.onWindowResize);
    window.addEventListener("keydown", this.boundOnButtonClick);
    this.controls.addEventListener("change", this.boundRender);
    window.addEventListener("click", this.mouseClickBounder);
    window.addEventListener("mousemove", this.mouseUpBounder);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    this.mixer.update(1 / 60);

    this.points.forEach((point) => {
      point.update();
    });

    if (this.currFocusPoint !== null) {
      this.camera.position.lerp(
        this.currFocusPoint.getLerpPosition(this.camera.position),
        0.05
      );

      this.controls.target.lerp(
        this.currFocusPoint.getLookAtPosition(
          this.camera.position,
          this.camera.up
        ),
        0.05
      );
    } else {
      this.camera.position.lerp(this.defaultCameraPosition, 0.05);
      this.controls.target.lerp(this.defaultCameraLookAt, 0.05);
    }

    this.controls.update();

    this.render();
  }

  setLights() {
    this.light = new THREE.AmbientLight(0xffffff, 2);
    this.light.position.set(10, 10, 10);
    this.scene.add(this.light);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
    this.render();
  }
  setPoints() {
    this.points = [
      new Point(
        this.scene,
        new THREE.Vector3(-4, 1, 5),
        this.camera.position,
        "Bibika",
        this.onTextClick.bind(this),
        0
      ),
      new Point(
        this.scene,
        new THREE.Vector3(8, 1, 2),
        this.camera.position,
        "SeekSpeak",
        this.onTextClick.bind(this),
        1
      ),
      new Point(
        this.scene,
        new THREE.Vector3(1, 1, 1),
        this.camera.position,
        "Dog breed identification",
        this.onTextClick.bind(this),
        2
      ),
    ];
  }
  textRenderer() {
    this.labelRenderer = new CSS2DRenderer();
    this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
    this.labelRenderer.domElement.style.position = "absolute";
    this.labelRenderer.domElement.style.top = "0px";

    const root = document.querySelector("#root");
    const canvas = document.querySelector("#webgl");
    root.insertBefore(this.labelRenderer.domElement, canvas);
  }
  onButtonClick(event) {
    switch (event.code) {
      case "ArrowUp":
        break;
      case "ArrowDown":
        break;
      case "ArrowLeft":
        this.selectPrevPoint();
        break;
      case "ArrowRight":
        this.selectNextPoint();
        break;
      case "Space":
        this.handleNavigation();
        break;
      case "Escape":
        this.resetFocusPoint();
        break;
      default:
        break;
    }
  }
  lerpToPosition(position) {
    this.camera.position.lerp(position, 0.05);
  }
  onTextClick(index) {
    this.currFocusIndex = index;

    this.updateFocus();
  }
  selectPointByIndex(index) {
    this.currFocusIndex = index;
    this.updateFocus();
  }
  selectNextPoint() {
    if (this.currFocusIndex + 1 == this.points.length) this.currFocusIndex = 0;
    else this.currFocusIndex++;

    this.updateFocus();
  }
  selectPrevPoint() {
    if (this.currFocusIndex == 0 || this.currFocusIndex == -1)
      this.currFocusIndex = this.points.length - 1;
    else this.currFocusIndex--;

    this.updateFocus();
  }
  updateFocus() {
    if (this.currFocusPoint !== undefined && this.currFocusPoint !== null) {
      this.isFocused = false;
      this.currFocusPoint.onFocusLost();
      this.changeFocusState("NON");
    }

    if (this.currFocusIndex < 0) {
      this.currFocusPoint = null;
      this.isFocused = false;
      this.changeFocusState("NON");
    } else {
      this.isFocused = true;
      this.currFocusPoint = this.points[this.currFocusIndex];
      this.currFocusPoint.onFocus();
      this.changeFocusState("FOCUSED");
    }
  }
  resetFocusPoint() {
    this.currFocusIndex = -1;
    this.updateFocus();
  }
  handleNavigation() {
    this.navigate("/projects/bibika");
    this.freeze();
  }
  unfreeze() {
    this.setEvents();
    this.labelRenderer.domElement.style.display = "block";
    document.querySelector("#webgl").style.display = "block";
    this.controls.enabled = true;
  }
  freeze() {
    window.removeEventListener("resize", this.onWindowResize);
    window.removeEventListener("keydown", this.boundOnButtonClick);
    this.controls.removeEventListener("change", this.boundRender);

    this.labelRenderer.domElement.style.display = "none";
    document.querySelector("#webgl").style.display = "none";
    this.controls.enabled = false;
  }
  onMeshMouseClick(event) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersects = this.raycaster.intersectObjects(
      this.points.map((x) => x.mesh)
    );

    for (let i = 0; i < intersects.length; i++) {
      var selectedPointIndex = this.points.findIndex(
        (x) => x.mesh === intersects[i].object
      );

      if (selectedPointIndex >= 0) {
        this.selectPointByIndex(selectedPointIndex);
      }
    }
  }
  onMeshMouseUp(event) {
    if (this.isFocused) return;
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersects = this.raycaster.intersectObjects(
      this.points.map((x) => x.mesh)
    );

    if (intersects.length === 0) this.points.forEach((x) => x.onHoverLost());

    for (let i = 0; i < intersects.length; i++) {
      var hoverPoint = this.points.find((x) => x.mesh === intersects[i].object);

      if (hoverPoint) {
        hoverPoint.onHover();
      }
    }
  }
}
