import {
  Component,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  HostListener,
  output,
  Input,
  signal,
} from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

@Component({
  selector: 'camp-ground-scene',
  template: ` <canvas #canvas3D></canvas> `,
  styles: [
    `
      :host {
        display: block;
      }
      canvas {
        display: block;
      }
    `,
  ],
})
export class CampGroundSceneComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas3D', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  @Input('currentProject') set currentProject(value: number) {
    requestAnimationFrame(() => this.focusOnPlane(value));
    this.currentProjectSignal.set(value);
  }
  currentProjectSignal = signal<number>(0);
  projectIndexChanged = output<number>();

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;

  // Groups and objects
  private group = new THREE.Group();
  private particles!: THREE.Points;
  private waypoints: THREE.Object3D[] = [];

  // For the “DNA” style arrangement
  private planeRadius = 375; // The distance from center
  private planeSpacingY = 150; // How far each plane is spaced on Y
  private angleOffset = 540; // The “yaw” in your old code (like 380/xmlList.length)...

  // Camera interpolation
  private goPosition = new THREE.Vector3(0, 0, 1000);
  private goTarget = new THREE.Vector3(0, 0, 0);

  private animationId?: number;

  constructor() {}

  ngAfterViewInit(): void {
    this.initScene();
    this.createParticles();
    this.createCameraPlotPoints();
    this.addLights();
    this.load3DModel();
    this.loadCloud3DModel();
    this.loadSatelliteModel();
    this.loadSRocketModel();
    this.addSkySphere();
    this.animate();

    this.focusOnPlane(0);
  }

  ngOnDestroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.renderer.dispose();
  }

  private initScene(): void {
    const canvas = this.canvasRef.nativeElement;
    this.renderer = new THREE.WebGLRenderer({ canvas });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      8000
    );
    this.camera.position.set(2000, 2000, 2000);
    this.scene.add(this.camera);

    this.scene.add(this.group);
  }

  private createParticles(): void {
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

  private createCameraPlotPoints(): void {
    this.waypoints = [];
    // Generate 10 plot points
    for (let i = 0; i < 10; i++) {
      const waypoint = new THREE.Object3D();
      const angle = (this.angleOffset / 10) * i * (Math.PI / 180);
      waypoint.position.x = Math.sin(angle) * this.planeRadius;
      waypoint.position.z = Math.cos(angle) * this.planeRadius;
      waypoint.position.y = i * this.planeSpacingY;

      waypoint.lookAt(new THREE.Vector3(0, waypoint.position.y, 0));

      this.waypoints.push(waypoint);
      this.group.add(waypoint);
    }

    this.group.position.set(-133, 175, -280);
    this.group.rotateY(89.7);
  }

  private load3DModel(): void {
    const loader = new GLTFLoader();
    loader.load(
      'assets/forest_island_camp_gltf/scene.gltf',
      (gltf) => {
        const model = gltf.scene;
        model.position.set(0, 0, 0);
        model.scale.set(0.2, 0.2, 0.2);
        this.scene.add(model);
      },
      undefined,
      (error) => {
        console.error('Error loading GLTF model:', error);
      }
    );
  }

  private loadCloud3DModel(): void {
    const loader = new GLTFLoader();
    loader.load(
      'assets/low_poly_cloud_pack_gltf/scene.gltf',
      (gltf) => {
        const model = gltf.scene;
        model.position.set(0, 1000, -100);
        model.scale.set(2, 2, 2);
        this.scene.add(model);
      },
      undefined,
      (error) => {
        console.error('Error loading GLTF model:', error);
      }
    );
  }

  private loadSatelliteModel(): void {
    const loader = new GLTFLoader();
    loader.load(
      'assets/cartoon_satellite_gltf/scene.gltf',
      (gltf) => {
        const model = gltf.scene;
        model.position.set(-350, 2000, 200);
        model.scale.set(300, 300, 300);
        model.rotateZ(0.5);
        this.scene.add(model);
      },
      undefined,
      (error) => {
        console.error('Error loading GLTF model:', error);
      }
    );
  }

  private loadSRocketModel(): void {
    const loader = new GLTFLoader();
    loader.load(
      'assets/cartoony_rocket_gltf/scene.gltf',
      (gltf) => {
        const model = gltf.scene;
        model.position.set(-300, 1000, 130);
        model.scale.set(20, 20, 20);
        this.scene.add(model);
      },
      undefined,
      (error) => {
        console.error('Error loading GLTF model:', error);
      }
    );
  }

  private addLights(): void {
    const hemiLight = new THREE.HemisphereLight(0xffa9cf, 0x4d2374, 0.1);
    this.scene.add(hemiLight);

    const ambientLight = new THREE.AmbientLight(0x7b5ba7, .7);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfdac53, 2);
    dirLight.position.set(-300, 200,300);
    dirLight.castShadow = true;
    this.scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0x7f41b6, 2);
    fillLight.position.set(200, 200, -300);
    this.scene.add(fillLight);
  }

  private addSkySphere() {
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

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') {
      // Move to the previous plane
      this.currentProjectSignal.update((value) => value - 1);
      if (this.currentProjectSignal() < 0) {
        this.currentProjectSignal.set(this.waypoints.length - 1);
      }
      this.focusOnPlane(this.currentProjectSignal());
      this.projectIndexChanged.emit(this.currentProjectSignal());
    } else if (event.key === 'ArrowRight') {
      // Move to the next plane
      this.currentProjectSignal.update((value) => value + 1);
      if (this.currentProjectSignal() >= this.waypoints.length) {
        this.currentProjectSignal.set(0);
      }
      this.focusOnPlane(this.currentProjectSignal());
      this.projectIndexChanged.emit(this.currentProjectSignal());
    }
  }

  private focusOnPlane(idx: number) {
    const planeObj = this.waypoints[idx];

    const planePos = new THREE.Vector3();
    planeObj.getWorldPosition(planePos);

    const planeDir = new THREE.Vector3();
    planeObj.getWorldDirection(planeDir);

    const distance = 300;
    const finalCamPos = planePos
      .clone()
      .add(planeDir.multiplyScalar(-distance));

    this.goPosition.copy(finalCamPos);
    this.goTarget.set(planePos.x, planePos.y, planePos.z);
  }

  private animate = () => {
    this.animationId = requestAnimationFrame(this.animate);

    // Smooth camera transitions
    this.camera.position.x -= (this.camera.position.x - this.goPosition.x) / 32;
    this.camera.position.y -= (this.camera.position.y - this.goPosition.y) / 32;
    this.camera.position.z -= (this.camera.position.z - this.goPosition.z) / 32;

    // Smooth target transition
    const lookX =
      this.camera.position.x - (this.camera.position.x - this.goTarget.x) / 32;
    const lookY =
      this.camera.position.y - (this.camera.position.y - this.goTarget.y) / 32;
    const lookZ =
      this.camera.position.z - (this.camera.position.z - this.goTarget.z) / 32;
    this.camera.lookAt(lookX, lookY, lookZ);

    this.renderer.render(this.scene, this.camera);
  };

  // Handle browser resizing
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
