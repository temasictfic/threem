import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'deneme';

  scene!: THREE.Scene;
  camera!: THREE.PerspectiveCamera;
  renderer!: THREE.WebGLRenderer;
  controls!: OrbitControls;
  texture!: THREE.Texture;
  material!: THREE.MeshPhongMaterial;
  scale: number = 1;
  positionX: number = 0;
  positionY: number = 0;
  cup!: THREE.Mesh;

  ngOnInit() {
    // Initialization logic if needed
  }

  ngAfterViewInit() {
    this.initThreeJs();
  }

  initThreeJs() {
    // Set up the scene, camera, and renderer
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / 2 / window.innerHeight,
      0.1,
      1000
    );
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth / 2, window.innerHeight);
    document
      .getElementById('cup-viewer')
      ?.appendChild(this.renderer.domElement);

    // Log camera position and renderer size
    console.log('Camera Position:', this.camera.position);
    console.log('Renderer Size:', this.renderer.getSize(new THREE.Vector2()));

    // Create a basic cup geometry
    const geometry = new THREE.CylinderGeometry(1, 0.7, 2, 32);
    this.material = new THREE.MeshPhongMaterial({ color: 0xffffff });
    this.cup = new THREE.Mesh(geometry, this.material);
    this.scene.add(this.cup);

    // Add point light
    /*     const pointLight = new THREE.PointLight(0xffffff, 100, 100);
    pointLight.position.set(0, 0, 10);
    this.scene.add(pointLight); */

    // Add directional light
/*     const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(5, 5, 5).normalize();
    this.scene.add(directionalLight); */

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    // Add multiple point lights
    const pointLight1 = new THREE.PointLight(0xffffff, 100, 100);
    pointLight1.position.set(5, 5, 5);
    this.scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xffffff, 100, 100);
    pointLight2.position.set(-5, 5, 5);
    this.scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0xffffff, 100, 100);
    pointLight3.position.set(5, -5, 5);
    this.scene.add(pointLight3);

    const pointLight4 = new THREE.PointLight(0xffffff, 100, 100);
    pointLight4.position.set(5, 5, -5);
    this.scene.add(pointLight4);

    this.camera.position.z = 5;

    // Log scene children
    console.log('Scene Children:', this.scene.children);

    // Add orbit controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.25;
    this.controls.screenSpacePanning = false;
    this.controls.maxPolarAngle = Math.PI / 2;

    window.addEventListener('resize', this.onWindowResize, false);
    // Start rendering loop
    this.animate();
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / 2 / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth / 2, window.innerHeight);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  uploadImage(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const img = new Image();
      img.onload = () => {
        this.texture = new THREE.Texture(img);
        this.texture.needsUpdate = true;
        this.material.map = this.texture;
        this.material.needsUpdate = true;
        console.log('Texture applied:', this.texture);
      };
      img.src = e.target.result;
      // Display preview
      const imagePreviewElement = document.getElementById('imagePreview');
      if (imagePreviewElement) {
        imagePreviewElement.innerHTML = '<img src="' + e.target.result + '">';
      }
    };
    reader.readAsDataURL(file);
  }

  updateTextureScale(event: any) {
    const scale = event.target.value;
    if (this.texture) {
      this.texture.repeat.set(scale, scale);
      this.texture.needsUpdate = true;
    }
  }

  updateTexturePositionX(event: any) {
    const x = event.target.value;
    const y = (document.getElementById('yPositionSlider') as HTMLInputElement)
      ?.value;
    if (this.texture) {
      const xValue = Number(x);
      const yValue = Number(y);
      this.texture.offset.set(xValue / 100, yValue / 100);
      this.texture.needsUpdate = true;
    }
  }

  updateTexturePositionY(event: any) {
    const y = event.target.value;
    const x = (document.getElementById('xPositionSlider') as HTMLInputElement)
      ?.value;
    if (this.texture) {
      const xValue = Number(x);
      const yValue = Number(y);
      this.texture.offset.set(xValue / 100, yValue / 100);
      this.texture.needsUpdate = true;
    }
  }
}
