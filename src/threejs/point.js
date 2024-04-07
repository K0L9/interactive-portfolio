import * as THREE from "three";
import { TextObject } from "./textObject";

export class Point {
  constructor(
    scene,
    position,
    cameraPosition,
    content,
    onTextClick,
    index,
    openTitle,
    openDescription
  ) {
    const SIZE = 0.3;
    const geometry = new THREE.SphereGeometry(SIZE, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const mesh = new THREE.Mesh(geometry, material);

    const centralMesh = new THREE.Mesh(
      new THREE.SphereGeometry(SIZE),
      new THREE.MeshBasicMaterial({
        transparent: true,
        visible: false,
      })
    );

    var AB = new THREE.Vector3()
      .subVectors(position, cameraPosition)
      .normalize();

    var rightVector = new THREE.Vector3(-AB.y, AB.x, 0);
    var scaledRightVector = rightVector.multiplyScalar(1);

    this.lookAtPosition = new THREE.Vector3().addVectors(
      position,
      scaledRightVector
    );

    mesh.position.copy(position);
    centralMesh.position.copy(position);

    this.mesh = mesh;
    scene.add(mesh);
    scene.add(centralMesh);

    this.textObject = new TextObject({
      textContent: content,
      targetObject: centralMesh,
      onTextClick,
      index,
    });

    this.scaleDirection = { x: 1, y: 1, z: 1 };
    this.scaleDuration = {
      x: Math.floor(Math.random() * 20 + 30),
      y: Math.floor(Math.random() * 20 + 30),
      z: Math.floor(Math.random() * 20 + 30),
    };

    this.scaleFactors = {
      x: { direction: 1, duration: this.getRandomDuration(), target: 1 },
      y: { direction: 1, duration: this.getRandomDuration(), target: 1 },
      z: { direction: 1, duration: this.getRandomDuration(), target: 1 },
    };

    this.focus = "non";
  }

  getLerpPosition(cameraPosition) {
    const distanceToLerpPoint = 3;

    var AB = new THREE.Vector3()
      .subVectors(this.mesh.position, cameraPosition)
      .normalize();

    var scaledVector = AB.multiplyScalar(distanceToLerpPoint * -1);

    const lerpPosition = new THREE.Vector3().addVectors(
      this.mesh.position,
      scaledVector
    );

    return lerpPosition;
  }
  getLookAtPosition(cameraPosition, cameraUp) {
    const distanceToLookAtPoint = 3; // Desired distance for the lookAt point from the object
    const rightShiftAmount = 1.75; // Shift to the right from the camera's perspective

    // Calculate the direction vector from the camera to the object
    let direction = new THREE.Vector3().subVectors(
      this.mesh.position,
      cameraPosition
    );

    // Before normalizing, check if the direction is not a zero vector
    if (direction.lengthSq() === 0) {
      console.error(
        "Direction is a zero vector. Adjust the cameraPosition or the object's position."
      );
      return null; // Or some default position
    }

    direction.normalize();

    // Calculate the right vector
    let right = new THREE.Vector3().crossVectors(direction, cameraUp);

    // Check if the right vector is not a zero vector
    if (right.lengthSq() === 0) {
      console.error(
        "Right vector is a zero vector. Adjust the cameraUp vector."
      );
      return null; // Or some default position
    }

    right.normalize();
    let scaledRightShift = right.multiplyScalar(rightShiftAmount);

    // Apply the right shift to the direction vector to get the final lookAt position
    let lookAtPosition = new THREE.Vector3().addVectors(
      this.mesh.position,
      scaledRightShift
    );

    return lookAtPosition;
  }

  onFocus() {
    this.focus = "get";
  }
  onFocusLost() {
    this.focus = "lost";
  }
  onHover() {
    this.focus = "hover";
  }
  onHoverLost() {
    this.focus = "lost";
  }

  update() {
    let growFactor = 1.01;
    switch (this.focus) {
      case "non": {
        break;
      }
      case "get": {
        this.updateScale("x");
        this.updateScale("y");
        this.updateScale("z");
        break;
      }
      case "hover": {
        if (this.mesh.geometry.boundingSphere.radius < 0.4) {
          this.mesh.geometry.scale(growFactor, growFactor, growFactor);
        } else {
          this.focus = "non";
        }
        break;
      }
      case "lost": {
        if (this.mesh.geometry.boundingSphere.radius > 0.3) {
          growFactor = 1 / growFactor;
          this.mesh.geometry.scale(growFactor, growFactor, growFactor);
        } else {
          this.focus = "non";
        }
      }
      default: {
        this.focus = "non";
      }
    }
  }

  adjustScale(axis) {
    // Adjust the scale based on the direction
    this.mesh.scale[axis] += this.scaleDirection[axis] * 0.005; // Smaller increment for smoother animation

    // Decrease the duration of the current scaling direction
    this.scaleDuration[axis]--;

    // If the duration for this direction has ended, switch direction and set a new duration
    if (this.scaleDuration[axis] <= 0) {
      this.scaleDirection[axis] *= -1; // Change direction
      this.scaleDuration[axis] = Math.floor(Math.random() * 30 + 30); // Set a new duration for this direction
    }

    // Ensure the scale in each dimension stays within reasonable limits
    this.mesh.scale[axis] = Math.max(
      1 / 1.2,
      Math.min(1.2, this.mesh.scale[axis])
    );
  }
  getRandomDuration() {
    return Math.floor(Math.random() * 20 + 10);
  }
  updateScale(axis) {
    this.mesh.scale[axis] +=
      (this.scaleFactors[axis].target - this.mesh.scale[axis]) * 0.05;

    this.scaleFactors[axis].duration -= 1;

    if (this.scaleFactors[axis].duration <= 0) {
      this.scaleFactors[axis].duration = this.getRandomDuration();
      this.scaleFactors[axis].target = Math.random() * 0.3 + 0.75;
    }
  }
}
