import { Injectable, NgZone, EventEmitter } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

@Injectable({ providedIn: 'root' })
export class ThreeCanvasService {
  // Core Three.js objects
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;

  // Render loop ID
  private animationId?: number;

  // A group to hold the planes (or any sub-objects)
  private group = new THREE.Group();

  // Particles
  private particles!: THREE.Points;

  // Planes
  private planeMeshes: THREE.Mesh[] = [];
  private hoveredObject: THREE.Object3D | null = null;

  // For the “DNA” style arrangement
  private planeRadius = 375;
  private planeSpacingY = 150;
  private angleOffset = 540;
  private images = [
    'assets/javascript.png',
    'assets/typescript.png',
    'assets/flash.png',
    'assets/gba.png',
    'assets/ngx-workshop.png',
    'assets/mountain-2.png',
    'assets/flash_cs4_firefly.png',
    'assets/flash_cs4.png',
    'assets/flash_cc.jpg',
    'assets/iis-7-welcome-screen.png',
    'assets/lamp.jpeg',
  ];

  // Camera interpolation targets
  private goPosition = new THREE.Vector3(0, 0, 1000);
  private goTarget = new THREE.Vector3(0, 0, 0);

  // Raycasting
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();

  // Example output if you want to notify the component
  // which plane was clicked, or if you want to track
  // the “currently selected index.”
  public planeClicked = new EventEmitter<number>();
  public currentPlaneIndex = 0;

  constructor(private ngZone: NgZone) {}

  /**
   * Initialize Three.js scene, camera, renderer, etc.
   */
  init(canvas: HTMLCanvasElement): void {
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
    });
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      8000
    );
    this.camera.position.set(3000, 3000, 3000);
    this.scene.add(this.camera);

    // Add the group to the scene
    this.scene.add(this.group);

    // Start the render loop
    this.startRenderingLoop();
  }

  /**
   * Example: create background particles.
   */
  createParticles(): void {
    const particleCount = 1000;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 3000;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    );

    const particleMaterial = new THREE.PointsMaterial({
      color: 0x00ffff,
      size: 5,
    });

    this.particles = new THREE.Points(particleGeometry, particleMaterial);
    this.particles.position.y = 2000;
    this.scene.add(this.particles);
  }

  /**
   * Create your "photo planes" (the boxes with textures).
   */
  createPhotoPlanes(): void {
    const textureLoader = new THREE.TextureLoader();
    this.planeMeshes = []; // reset array

    this.images.forEach((img, i) => {
      const texture = textureLoader.load(img);
      const geometry = new THREE.BoxGeometry(260, 146, 30);

      const materials = [
        new THREE.MeshLambertMaterial({ color: 0x555555 }), // +x
        new THREE.MeshLambertMaterial({ color: 0x555555 }), // -x
        new THREE.MeshLambertMaterial({ color: 0x555555 }), // +y
        new THREE.MeshLambertMaterial({ color: 0x555555 }), // -y
        new THREE.MeshLambertMaterial({ color: 0x555555 }), // +z (front)
        new THREE.MeshBasicMaterial({ map: texture }),       // -z (back)
      ];

      const boxMesh = new THREE.Mesh(geometry, materials);

      // Position each plane in a spiral or “DNA” arrangement
      const angle = (this.angleOffset / this.images.length) * i * (Math.PI / 180);
      boxMesh.position.x = Math.sin(angle) * this.planeRadius;
      boxMesh.position.z = Math.cos(angle) * this.planeRadius;
      boxMesh.position.y = i * this.planeSpacingY;

      // Make the plane face inward
      boxMesh.lookAt(new THREE.Vector3(0, boxMesh.position.y, 0));

      this.planeMeshes.push(boxMesh);
      this.group.add(boxMesh);
    });

    // Position and rotate the entire group if needed
    this.group.position.set(-133, 175, -280);
    this.group.rotation.y = 89.7;
  }

  /**
   * Add lights to the scene.
   */
  addLights(): void {
    const hemiLight = new THREE.HemisphereLight(0xffc37d, 0x442222, 0.3);
    this.scene.add(hemiLight);

    const ambientLight = new THREE.AmbientLight(0x72015f, 3);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(200, 100, 200);
    this.scene.add(dirLight);

    const dirLight2 = new THREE.DirectionalLight(0x72015f, 3);
    dirLight2.position.set(300, 200, -200);
    this.scene.add(dirLight2);
  }

  /**
   * Load a GLTF model (e.g. your forest island).
   */
  load3DModel(path: string): void {
    const loader = new GLTFLoader();
    loader.load(
      path,
      (gltf) => {
        const model = gltf.scene;
        model.position.set(0, 0, 0);
        model.scale.set(0.2, 0.2, 0.2);
        this.scene.add(model);
      },
      undefined,
      (error) => console.error('Error loading GLTF model:', error)
    );
  }

  /**
   * Optionally add a sky sphere, gradient, etc.
   */
  addSkySphere(): void {
    const skyGeo = new THREE.SphereGeometry(3500, 32, 32);
    const skyMat = new THREE.ShaderMaterial({
      uniforms: {
        topColor: { value: new THREE.Color(0x0000ff) }, // Blue
        bottomColor: { value: new THREE.Color(0xffffff) }, // White
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        varying vec3 vWorldPosition;
        void main() {
          float h = normalize(vWorldPosition).y * 0.5 + 0.5;
          // "h" goes from 0 to 1 as we move from bottom to top
          gl_FragColor = vec4(mix(bottomColor, topColor, h), 1.0);
        }
      `,
      side: THREE.BackSide,
    });

    const skyMesh = new THREE.Mesh(skyGeo, skyMat);
    this.scene.add(skyMesh);
  }

  /**
   * Handle window resizing.
   */
  onWindowResize() {
    if (!this.camera || !this.renderer) return;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  /**
   * Handle pointer movement. The component’s hostListener can call this method.
   */
  onPointerMove(event: PointerEvent) {
    if (!this.camera) return;

    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.planeMeshes);
    if (intersects.length > 0) {
      const intersected = intersects[0].object;
      if (this.hoveredObject !== intersected) {
        // We just “entered” a new plane
        this.onPlaneOver(intersected);
      }
    } else {
      // We aren’t over any plane
      if (this.hoveredObject) {
        this.onPlaneOut(this.hoveredObject);
      }
    }
  }

  /**
   * Handle pointer down/click events.
   */
  onPointerDown(event: PointerEvent) {
    if (!this.camera) return;

    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.planeMeshes);
    if (intersects.length > 0) {
      const intersected = intersects[0].object;
      this.onPlaneClick(intersected);
    }
  }

  private onPlaneOver(object: THREE.Object3D) {
    // If something else was hovered, trigger out on that
    if (this.hoveredObject && this.hoveredObject !== object) {
      this.onPlaneOut(this.hoveredObject);
    }
    this.hoveredObject = object;
    // Example: scale up a bit or change color
    object.scale.set(1.1, 1.1, 1.1);
  }

  private onPlaneOut(object: THREE.Object3D) {
    // Reset scale
    object.scale.set(1, 1, 1);
    if (this.hoveredObject === object) {
      this.hoveredObject = null;
    }
  }

  private onPlaneClick(object: THREE.Object3D) {
    // Find which plane index was clicked
    const index = this.planeMeshes.indexOf(object as THREE.Mesh);
    if (index !== -1) {
      this.currentPlaneIndex = index;
      this.focusOnPlane(index);
      this.planeClicked.emit(index);
    }
  }

  /**
   * Handle keyboard navigation for previous/next planes.
   */
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') {
      // Move to the previous plane
      this.currentPlaneIndex--;
      if (this.currentPlaneIndex < 0) {
        this.currentPlaneIndex = this.planeMeshes.length - 1;
      }
      this.focusOnPlane(this.currentPlaneIndex);
      this.planeClicked.emit(this.currentPlaneIndex);
    } else if (event.key === 'ArrowRight') {
      // Move to the next plane
      this.currentPlaneIndex++;
      if (this.currentPlaneIndex >= this.planeMeshes.length) {
        this.currentPlaneIndex = 0;
      }
      this.focusOnPlane(this.currentPlaneIndex);
      this.planeClicked.emit(this.currentPlaneIndex);
    }
  }

  /**
   * Focus the camera on a particular plane index.
   */
  focusOnPlane(idx: number) {
    const planeObj = this.planeMeshes[idx];
    if (!planeObj) return;

    const planePos = new THREE.Vector3();
    planeObj.getWorldPosition(planePos);

    // Get plane's forward direction
    const planeDir = new THREE.Vector3();
    planeObj.getWorldDirection(planeDir);

    // Adjust these as needed (distance behind or in front)
    const distance = 200;
    const finalCamPos = planePos.clone().add(planeDir.multiplyScalar(-distance));

    this.goPosition.copy(finalCamPos);
    this.goTarget.set(planePos.x, planePos.y, planePos.z);
  }

  /**
   * The main render loop, run outside Angular’s zone.
   */
  private startRenderingLoop() {
    this.ngZone.runOutsideAngular(() => {
      const renderLoop = () => {
        this.animationId = requestAnimationFrame(renderLoop);

        // Interpolate camera towards goPosition
        this.camera.position.x -= (this.camera.position.x - this.goPosition.x) / 32;
        this.camera.position.y -= (this.camera.position.y - this.goPosition.y) / 32;
        this.camera.position.z -= (this.camera.position.z - this.goPosition.z) / 32;

        // Interpolate camera lookAt
        const lookX = this.camera.position.x - (this.camera.position.x - this.goTarget.x) / 32;
        const lookY = this.camera.position.y - (this.camera.position.y - this.goTarget.y) / 32;
        const lookZ = this.camera.position.z - (this.camera.position.z - this.goTarget.z) / 32;
        this.camera.lookAt(lookX, lookY, lookZ);

        // e.g. rotate the group slowly
        // this.group.rotation.y += 0.003;

        this.renderer.render(this.scene, this.camera);
      };
      renderLoop();
    });
  }

  /**
   * Cleanup. Call this in your component’s ngOnDestroy().
   */
  dispose(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
    // ...other cleanup as needed
  }
}