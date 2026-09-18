import * as THREE from 'three';
import { ArtifactMeshType, Exhibit } from '../types/museum';

export type GraphicQuality = 'high' | 'balanced' | 'fast';

export interface MuseumSceneSetup {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  pedestalMeshes: Map<string, THREE.Group>;
  waypointMeshes: THREE.Mesh[];
  cleanup: () => void;
  update: (delta: number) => void;
  teleportTo: (position: [number, number, number], lookAt?: [number, number, number]) => void;
  isTeleporting: () => boolean;
  setQuality: (quality: GraphicQuality) => void;
  getQuality: () => GraphicQuality;
}

// Procedural texture generator for modern luxury white & gold Carrara museum marble floor
function createMarbleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Bright luxury Italian Carrara white-cream marble base
  const bgGrad = ctx.createLinearGradient(0, 0, 512, 512);
  bgGrad.addColorStop(0, '#fafaf9');
  bgGrad.addColorStop(0.5, '#f5f5f4');
  bgGrad.addColorStop(1, '#f8fafc');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 512, 512);

  // Soft subtle warm gray marble clouds
  for (let i = 0; i < 8; i++) {
    const radGrad = ctx.createRadialGradient(
      Math.random() * 512, Math.random() * 512, 10,
      Math.random() * 512, Math.random() * 512, 180
    );
    radGrad.addColorStop(0, 'rgba(226, 232, 240, 0.45)');
    radGrad.addColorStop(1, 'rgba(248, 250, 252, 0)');
    ctx.fillStyle = radGrad;
    ctx.fillRect(0, 0, 512, 512);
  }

  // Golden and amber royal marble veins
  ctx.strokeStyle = 'rgba(217, 119, 6, 0.24)';
  ctx.lineWidth = 1.6;
  for (let i = 0; i < 18; i++) {
    ctx.beginPath();
    let x = Math.random() * 512;
    let y = Math.random() * 512;
    ctx.moveTo(x, y);
    for (let j = 0; j < 5; j++) {
      x += (Math.random() - 0.5) * 120;
      y += (Math.random() - 0.5) * 120;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // Delicate champagne gold hairline veins
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.32)';
  ctx.lineWidth = 0.9;
  for (let i = 0; i < 14; i++) {
    ctx.beginPath();
    let x = Math.random() * 512;
    let y = Math.random() * 512;
    ctx.moveTo(x, y);
    for (let j = 0; j < 6; j++) {
      x += (Math.random() - 0.5) * 100;
      y += (Math.random() - 0.5) * 100;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // Polished golden brass tile inlay borders
  ctx.strokeStyle = 'rgba(217, 119, 6, 0.35)';
  ctx.lineWidth = 3;
  ctx.strokeRect(4, 4, 504, 504);

  // Inset inner gold border
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.18)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(16, 16, 480, 480);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(12, 12);
  return texture;
}

// Create custom procedural 3D model for each Acehnese historical artifact
export function createArtifactMesh(type: ArtifactMeshType): THREE.Group {
  const group = new THREE.Group();

  switch (type) {
    case 'cap_sikureueng': {
      // Royal 9-seal medallion of Sultan Iskandar Muda
      const goldMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        metalness: 0.88,
        roughness: 0.22,
      });
      const cushionMat = new THREE.MeshStandardMaterial({
        color: 0x064e3b, // Dark velvet emerald
        roughness: 0.9,
      });
      const goldTrim = new THREE.MeshStandardMaterial({
        color: 0xd97706,
        metalness: 0.8,
        roughness: 0.3,
      });

      // Hexagonal presentation cushion
      const cushion = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.75, 0.14, 6), cushionMat);
      cushion.position.y = 0.2;
      group.add(cushion);

      // Cushion gold cord trim
      const cord = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.025, 8, 6), goldTrim);
      cord.rotation.x = Math.PI / 2;
      cord.position.y = 0.26;
      group.add(cord);

      // Main large seal disk
      const sealDisk = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.04, 32), goldMat);
      sealDisk.position.y = 0.32;
      group.add(sealDisk);

      // Center seal (Sultan Iskandar Muda)
      const centerCircle = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.05, 24), goldTrim);
      centerCircle.position.y = 0.34;
      group.add(centerCircle);

      // 8 surrounding circles (Ancestral Sultans)
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const subSeal = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.048, 16), goldMat);
        subSeal.position.set(Math.cos(angle) * 0.3, 0.34, Math.sin(angle) * 0.3);
        group.add(subSeal);
      }

      // Handle at the back
      const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.07, 0.35, 16), goldMat);
      handle.position.y = 0.52;
      group.add(handle);
      break;
    }

    case 'meriam_lada_sicupak': {
      // Historical Ottoman-Aceh bronze cannon
      const bronzeMat = new THREE.MeshStandardMaterial({
        color: 0x92400e,
        metalness: 0.75,
        roughness: 0.35,
      });
      const woodMat = new THREE.MeshStandardMaterial({
        color: 0x451a03,
        roughness: 0.8,
      });
      const ironMat = new THREE.MeshStandardMaterial({
        color: 0x27272a,
        metalness: 0.6,
        roughness: 0.4,
      });

      // Wooden carriage chassis
      const carriage = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.22, 1.4), woodMat);
      carriage.position.set(0, 0.35, 0);
      group.add(carriage);

      // Two heavy spoked wheels
      [-0.32, 0.32].forEach((xOffset) => {
        const wheelGroup = new THREE.Group();
        const rim = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.05, 12, 24), ironMat);
        wheelGroup.add(rim);
        const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.1, 16), ironMat);
        hub.rotation.z = Math.PI / 2;
        wheelGroup.add(hub);

        // Spokes
        for (let i = 0; i < 6; i++) {
          const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.58, 0.03), woodMat);
          spoke.rotation.z = (i * Math.PI) / 6;
          wheelGroup.add(spoke);
        }

        wheelGroup.position.set(xOffset, 0.32, -0.15);
        wheelGroup.rotation.y = Math.PI / 2;
        group.add(wheelGroup);
      });

      // Bronze Cannon Barrel
      const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.16, 1.6, 20), bronzeMat);
      barrel.rotation.x = Math.PI / 2 - 0.15; // Pointing upwards
      barrel.position.set(0, 0.55, 0.05);
      group.add(barrel);

      // Cascabel ball at the rear
      const cascabel = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 16), bronzeMat);
      cascabel.position.set(0, 0.44, 0.82);
      group.add(cascabel);

      // Muzzle flare
      const muzzle = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.11, 0.12, 20), bronzeMat);
      muzzle.rotation.x = Math.PI / 2 - 0.15;
      muzzle.position.set(0, 0.66, -0.72);
      group.add(muzzle);
      break;
    }

    case 'peta_kuno_sumatra': {
      // Historical Map on wooden easel (The Graphic London 1883 & Roayaume d'Achem)
      const easelMat = new THREE.MeshStandardMaterial({ color: 0x573416, roughness: 0.7 });
      const frameMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.7, roughness: 0.3 });
      const mapMat = new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.9 });

      // Easel legs
      const legGeo = new THREE.BoxGeometry(0.05, 1.6, 0.05);
      const legL = new THREE.Mesh(legGeo, easelMat);
      legL.position.set(-0.35, 0.8, -0.1);
      legL.rotation.z = -0.12;
      const legR = new THREE.Mesh(legGeo, easelMat);
      legR.position.set(0.35, 0.8, -0.1);
      legR.rotation.z = 0.12;
      const legBack = new THREE.Mesh(legGeo, easelMat);
      legBack.position.set(0, 0.8, 0.25);
      legBack.rotation.x = 0.22;
      group.add(legL, legR, legBack);

      // Map Frame & Canvas
      const frame = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.8, 0.06), frameMat);
      frame.position.set(0, 0.95, -0.04);
      frame.rotation.x = -0.1;
      group.add(frame);

      const paper = new THREE.Mesh(new THREE.PlaneGeometry(0.96, 0.66), mapMat);
      paper.position.set(0, 0.95, -0.005);
      paper.rotation.x = -0.1;
      group.add(paper);

      // Coastline representation of Sumatra on map
      const lineMat = new THREE.MeshBasicMaterial({ color: 0x047857 });
      for (let i = 0; i < 10; i++) {
        const islandSlice = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.03 + i * 0.03, 0.01), lineMat);
        islandSlice.position.set(-0.25 + i * 0.05, 0.88 + i * 0.02, 0.005);
        islandSlice.rotation.x = -0.1;
        islandSlice.rotation.z = -0.3;
        group.add(islandSlice);
      }
      break;
    }

    case 'naskah_hikayat_prang_sabil': {
      // Manuscript of Hikayat Prang Sabil & Walking staff of Teungku Chik di Tiro
      const leatherMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 });
      const pageMat = new THREE.MeshStandardMaterial({ color: 0xfef9c3, roughness: 0.85 });
      const hornMat = new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.3, metalness: 0.2 });
      const woodMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.7 });

      // Open book base
      const bookLeft = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.05, 0.55), leatherMat);
      bookLeft.position.set(-0.21, 0.35, 0);
      bookLeft.rotation.z = -0.08;
      const bookRight = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.05, 0.55), leatherMat);
      bookRight.position.set(0.21, 0.35, 0);
      bookRight.rotation.z = 0.08;
      group.add(bookLeft, bookRight);

      // Pages
      const pageL = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.03, 0.52), pageMat);
      pageL.position.set(-0.2, 0.38, 0);
      pageL.rotation.z = -0.08;
      const pageR = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.03, 0.52), pageMat);
      pageR.position.set(0.2, 0.38, 0);
      pageR.rotation.z = 0.08;
      group.add(pageL, pageR);

      // Gold calligraphy lines
      const goldInk = new THREE.MeshBasicMaterial({ color: 0xd97706 });
      for (let i = 0; i < 6; i++) {
        const lineL = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.015), goldInk);
        lineL.position.set(-0.2, 0.4 + i * 0.001, -0.16 + i * 0.065);
        lineL.rotation.x = -Math.PI / 2;
        lineL.rotation.y = -0.08;
        const lineR = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.015), goldInk);
        lineR.position.set(0.2, 0.4 + i * 0.001, -0.16 + i * 0.065);
        lineR.rotation.x = -Math.PI / 2;
        lineR.rotation.y = 0.08;
        group.add(lineL, lineR);
      }

      // Teungku Chik di Tiro walking staff
      const staff = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.025, 1.1, 12), woodMat);
      staff.position.set(0.42, 0.55, 0.2);
      staff.rotation.z = 0.15;
      group.add(staff);

      const staffHandle = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.025, 8, 16, Math.PI), hornMat);
      staffHandle.position.set(0.34, 1.08, 0.2);
      staffHandle.rotation.z = Math.PI / 2;
      group.add(staffHandle);
      break;
    }

    case 'rencong_cut_nyak_dien': {
      // Rencong Pusaka Cut Nyak Dhien & Bawar Teuku Umar
      const steelMat = new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        metalness: 0.95,
        roughness: 0.15,
      });
      const ivoryMat = new THREE.MeshStandardMaterial({
        color: 0xfef3c7,
        roughness: 0.35,
      });
      const goldMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        metalness: 0.9,
        roughness: 0.2,
      });
      const standMat = new THREE.MeshStandardMaterial({
        color: 0x881337, // Royal crimson lacquer
        roughness: 0.4,
      });

      // Velvet display stand
      const standBase = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.08, 0.3), standMat);
      standBase.position.y = 0.3;
      group.add(standBase);

      const forkL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.25, 0.04), standMat);
      forkL.position.set(-0.2, 0.44, 0);
      const forkR = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.32, 0.04), standMat);
      forkR.position.set(0.2, 0.48, 0);
      group.add(forkL, forkR);

      // Rencong Curved Blade (Shape of Bismillah)
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.55, 0.06), steelMat);
      blade.position.set(-0.02, 0.56, 0);
      blade.rotation.z = -Math.PI / 3.6;
      group.add(blade);

      // Gold collar (Ring ring)
      const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.045, 0.06, 16), goldMat);
      collar.position.set(-0.24, 0.42, 0);
      collar.rotation.z = -Math.PI / 3.6;
      group.add(collar);

      // Hulu Meucangge (Curved handle of ivory / horn)
      const handle = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.035, 12, 16, Math.PI * 0.7), ivoryMat);
      handle.position.set(-0.32, 0.45, 0);
      handle.rotation.z = Math.PI / 1.5;
      group.add(handle);

      // Decorated scabbard lying below
      const scabbard = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.52, 0.08), goldMat);
      scabbard.position.set(0.05, 0.36, 0.08);
      scabbard.rotation.z = -Math.PI / 3.8;
      group.add(scabbard);
      break;
    }

    case 'pita_darah_alue_simi': {
      // Bloodstained Bandage & Seal Ring of Teungku Maat di Tiro (1911)
      const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.35,
        roughness: 0.05,
        transmission: 0.9,
      });
      const clothMat = new THREE.MeshStandardMaterial({
        color: 0x991b1b, // Blood crimson on linen
        roughness: 0.9,
      });
      const ringGold = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        metalness: 0.9,
        roughness: 0.18,
      });

      // Glass museum vitrine
      const vitrine = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.45, 0.55), glassMat);
      vitrine.position.y = 0.55;
      group.add(vitrine);

      // Black velvet tray inside
      const tray = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.05, 0.45), new THREE.MeshStandardMaterial({ color: 0x18181b }));
      tray.position.y = 0.36;
      group.add(tray);

      // Coiled linen bandage with blood spots
      const bandage = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.05, 12, 24), clothMat);
      bandage.rotation.x = Math.PI / 2;
      bandage.position.set(-0.1, 0.42, 0);
      group.add(bandage);

      // Gold signet ring of Teungku Maat
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.015, 12, 24), ringGold);
      ring.position.set(0.16, 0.42, 0.05);
      ring.rotation.x = Math.PI / 4;
      group.add(ring);

      const ringStone = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.02, 16), ringGold);
      ringStone.position.set(0.16, 0.46, 0.08);
      group.add(ringStone);
      break;
    }

    case 'naskah_deklarasi_1976': {
      // Declaration of Independence document on Tjokkan Hill rock pedestal
      const rockMat = new THREE.MeshStandardMaterial({ color: 0x44403c, roughness: 0.9 });
      const paperMat = new THREE.MeshStandardMaterial({ color: 0xfafaf9, roughness: 0.85 });
      const inkMat = new THREE.MeshBasicMaterial({ color: 0x09090b });

      // Rough stone altar representing Gunong Halimon / Tjokkan Hill
      const rock1 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.48), rockMat);
      rock1.position.set(0, 0.35, 0);
      rock1.scale.set(1.4, 0.7, 1.2);
      group.add(rock1);

      // Proclamation document folio
      const doc = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.75), paperMat);
      doc.position.set(0, 0.62, 0);
      doc.rotation.x = -Math.PI / 3;
      group.add(doc);

      // Typed lines on the declaration document
      for (let i = 0; i < 10; i++) {
        const line = new THREE.Mesh(new THREE.PlaneGeometry(0.44, 0.018), inkMat);
        line.position.set(0, 0.75 - i * 0.045, 0.12 - i * 0.025);
        line.rotation.x = -Math.PI / 3;
        group.add(line);
      }

      // Red seal of Aceh Sumatra State
      const redSeal = new THREE.Mesh(
        new THREE.CircleGeometry(0.045, 16),
        new THREE.MeshBasicMaterial({ color: 0xb91c1c })
      );
      redSeal.position.set(0.14, 0.48, 0.22);
      redSeal.rotation.x = -Math.PI / 3;
      group.add(redSeal);
      break;
    }

    case 'arsip_acheh_institute_pbb': {
      // Diplomatic briefcase & Kurt Waldheim UN photo easel
      const leatherMat = new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.5 });
      const brassMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.9, roughness: 0.2 });
      const photoMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.7 });

      // Diplomatic briefcase
      const briefcase = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.14, 0.38), leatherMat);
      briefcase.position.set(-0.16, 0.38, 0.08);
      group.add(briefcase);

      // Brass latches
      [-0.1, 0.1].forEach((xOff) => {
        const latch = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.04, 0.02), brassMat);
        latch.position.set(-0.16 + xOff, 0.42, 0.28);
        group.add(latch);
      });

      // Framed UN Photo (Kurt Waldheim & Hasan di Tiro)
      const photoFrame = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.62, 0.03), brassMat);
      photoFrame.position.set(0.22, 0.65, -0.05);
      photoFrame.rotation.y = -0.3;
      photoFrame.rotation.x = -0.1;
      group.add(photoFrame);

      const photoSurface = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.54), photoMat);
      photoSurface.position.set(0.22, 0.65, -0.03);
      photoSurface.rotation.y = -0.3;
      photoSurface.rotation.x = -0.1;
      group.add(photoSurface);
      break;
    }

    case 'bendera_bulan_bintang_1976': {
      // Flagpole with fluttering Moon & Star Flag with black stripes
      const poleMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.8, roughness: 0.2 });
      const redMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.7, side: THREE.DoubleSide });
      const blackMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.8, side: THREE.DoubleSide });
      const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.6, side: THREE.DoubleSide });

      // Tall mast
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.025, 2.2, 16), poleMat);
      pole.position.set(-0.35, 1.1, 0);
      group.add(pole);

      // Spear finial
      const finial = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.12, 12), poleMat);
      finial.position.set(-0.35, 2.24, 0);
      group.add(finial);

      // Flag Cloth Body (Red)
      const flagGeo = new THREE.PlaneGeometry(0.85, 0.55, 12, 8);
      // Gentle wavy perturbation
      const posAttr = flagGeo.attributes.position;
      for (let i = 0; i < posAttr.count; i++) {
        const x = posAttr.getX(i);
        posAttr.setZ(i, Math.sin(x * 5) * 0.04);
      }
      flagGeo.computeVertexNormals();

      const flag = new THREE.Mesh(flagGeo, redMat);
      flag.position.set(0.08, 1.85, 0);
      group.add(flag);

      // Top Black Stripe
      const topStripe = new THREE.Mesh(new THREE.PlaneGeometry(0.85, 0.07), blackMat);
      topStripe.position.set(0.08, 2.05, 0.005);
      group.add(topStripe);

      // Bottom Black Stripe
      const botStripe = new THREE.Mesh(new THREE.PlaneGeometry(0.85, 0.07), blackMat);
      botStripe.position.set(0.08, 1.65, 0.005);
      group.add(botStripe);

      // Crescent & Star in center
      const crescent = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.025, 8, 24, Math.PI * 1.3), whiteMat);
      crescent.position.set(0.06, 1.85, 0.01);
      crescent.rotation.z = Math.PI / 4;
      group.add(crescent);

      const star = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), whiteMat);
      star.position.set(0.15, 1.85, 0.01);
      group.add(star);
      break;
    }

    case 'buku_price_of_freedom': {
      // "The Price of Freedom" 1984 book on museum reading lectern
      const woodMat = new THREE.MeshStandardMaterial({ color: 0x3f200c, roughness: 0.6 });
      const coverMat = new THREE.MeshStandardMaterial({ color: 0x14532d, roughness: 0.5 }); // Dark green cover
      const goldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.85, roughness: 0.2 });

      // Lectern pedestal stand
      const lecternTop = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.04, 0.5), woodMat);
      lecternTop.position.set(0, 0.55, 0);
      lecternTop.rotation.x = -0.3;
      group.add(lecternTop);

      // Book cover
      const book = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.07, 0.38), coverMat);
      book.position.set(0, 0.6, 0.02);
      book.rotation.x = -0.3;
      group.add(book);

      // Gold embossed coat-of-arms crest on cover
      const crest = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.01, 16), goldMat);
      crest.position.set(0, 0.64, 0.03);
      crest.rotation.x = -0.3;
      group.add(crest);
      break;
    }

    case 'mesin_ketik_drama_history': {
      // Portable Olympia Typewriter used in Alue Tjring
      const metalMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5, metalness: 0.6 });
      const keysMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 });
      const paperMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.9 });

      // Typewriter body
      const base = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.12, 0.48), metalMat);
      base.position.y = 0.36;
      group.add(base);

      // Keyboard slope
      const keysBank = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.04, 0.2), keysMat);
      keysBank.position.set(0, 0.42, 0.12);
      keysBank.rotation.x = 0.2;
      group.add(keysBank);

      // Paper cylinder roller
      const roller = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.52, 16), metalMat);
      roller.rotation.z = Math.PI / 2;
      roller.position.set(0, 0.48, -0.1);
      group.add(roller);

      // Typed manuscript sheet (Drama of Achehnese History)
      const typedSheet = new THREE.Mesh(new THREE.PlaneGeometry(0.38, 0.45), paperMat);
      typedSheet.position.set(0, 0.64, -0.09);
      typedSheet.rotation.x = -0.35;
      group.add(typedSheet);
      break;
    }

    case 'radio_voice_of_free_acheh': {
      // Guerrilla shortwave radio transmitter (Alue Seupot 1978)
      const radioCaseMat = new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.7 });
      const chromeMat = new THREE.MeshStandardMaterial({ color: 0xd4d4d8, metalness: 0.9, roughness: 0.15 });
      const dialMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3 });

      // Main transmitter box
      const radioBox = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.36, 0.4), radioCaseMat);
      radioBox.position.y = 0.48;
      group.add(radioBox);

      // Dials & Frequency meters
      [-0.18, 0, 0.18].forEach((xOff, i) => {
        const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.03, 16), i === 1 ? dialMat : chromeMat);
        dial.rotation.x = Math.PI / 2;
        dial.position.set(xOff, 0.54, 0.21);
        group.add(dial);
      });

      // Reel-to-reel tape spools on side
      [-0.14, 0.14].forEach((xOff) => {
        const reel = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.02, 24), chromeMat);
        reel.rotation.x = Math.PI / 2;
        reel.position.set(xOff, 0.38, 0.21);
        group.add(reel);
      });

      // Telescopic Antenna
      const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.015, 1.2, 12), chromeMat);
      antenna.position.set(0.26, 1.1, -0.12);
      antenna.rotation.z = -0.15;
      group.add(antenna);
      break;
    }
  }

  return group;
}

// Assemble full interactive 3D museum environment
export function initMuseumScene(
  container: HTMLDivElement,
  exhibits: Exhibit[],
  onExhibitClick: (exhibitId: string) => void,
  onHoverExhibit: (exhibitId: string | null) => void,
  onTeleportStart?: (position: [number, number, number], lookAt?: [number, number, number]) => void
): MuseumSceneSetup {
  const scene = new THREE.Scene();
  // Modern, cheerful, luminous sky atrium background
  scene.background = new THREE.Color(0xf0f7ff);
  // Airy, subtle atmospheric depth — crisp, clear and inviting
  scene.fog = new THREE.FogExp2(0xf1f5f9, 0.005);

  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || window.innerHeight;

  const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 100);
  camera.position.set(0, 1.6, 0); // Start in Grand Center Rotunda at eye height (1.6m)

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: 'high-performance',
  });
  renderer.setSize(width, height);
  // Cap devicePixelRatio to 1.25 for crisp rendering without 4K GPU fill-rate exhaustion
  let currentQuality: GraphicQuality = 'balanced';
  const getQualityPixelRatio = (q: GraphicQuality) => (q === 'high' ? Math.min(window.devicePixelRatio, 1.5) : q === 'balanced' ? 1.0 : 0.85);
  renderer.setPixelRatio(getQualityPixelRatio(currentQuality));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25; // Bright, luminous modern gallery exposure
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap; // PCF is significantly faster than PCFSoft
  renderer.xr.enabled = true;

  container.appendChild(renderer.domElement);

  // Cheerful, Balanced Museum Lighting
  const ambientLight = new THREE.AmbientLight(0xfffaed, 0.85);
  scene.add(ambientLight);

  // Hemispherical natural sky bounce: clear daylight sky from above, warm gold bounce from floor
  const hemiLight = new THREE.HemisphereLight(0xbae6fd, 0xfef3c7, 0.7);
  scene.add(hemiLight);

  // Central Rotunda Daylight Oculus Sun — optimized shadow resolution & camera frustum
  const rotundaSun = new THREE.DirectionalLight(0xffedd5, 1.2);
  rotundaSun.position.set(0, 18, 0);
  rotundaSun.castShadow = true;
  rotundaSun.shadow.mapSize.width = 1024;
  rotundaSun.shadow.mapSize.height = 1024;
  rotundaSun.shadow.camera.near = 1;
  rotundaSun.shadow.camera.far = 30;
  rotundaSun.shadow.camera.left = -22;
  rotundaSun.shadow.camera.right = 22;
  rotundaSun.shadow.camera.top = 22;
  rotundaSun.shadow.camera.bottom = -22;
  rotundaSun.shadow.bias = -0.0005;
  scene.add(rotundaSun);

  // Polished Modern Carrara White Marble Floor
  const marbleTex = createMarbleTexture();
  const floorGeo = new THREE.PlaneGeometry(60, 60);
  const floorMat = new THREE.MeshStandardMaterial({
    map: marbleTex,
    roughness: 0.16, // High polish, luminous reflections
    metalness: 0.08,
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  // Modern Architectural Ceiling with Central Skylight Oculus
  const ceilingGeo = new THREE.PlaneGeometry(60, 60);
  const ceilingMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.7,
  });
  const ceiling = new THREE.Mesh(ceilingGeo, ceilingMat);
  ceiling.position.y = 8;
  ceiling.rotation.x = Math.PI / 2;
  scene.add(ceiling);

  // Grand Skylight Oculus Dome in Center Ceiling
  const oculusRing = new THREE.Mesh(
    new THREE.TorusGeometry(5.2, 0.35, 16, 48),
    new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.85, roughness: 0.2 })
  );
  oculusRing.position.set(0, 7.95, 0);
  oculusRing.rotation.x = Math.PI / 2;
  scene.add(oculusRing);

  // Luminous blue sky glass disk in Oculus
  const oculusGlass = new THREE.Mesh(
    new THREE.CircleGeometry(5.0, 32),
    new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.35, side: THREE.DoubleSide })
  );
  oculusGlass.position.set(0, 7.97, 0);
  oculusGlass.rotation.x = Math.PI / 2;
  scene.add(oculusGlass);

  // Contemporary Museum Gallery Walls (Bright, Warm Alabaster White)
  const wallMat = new THREE.MeshStandardMaterial({
    color: 0xf4f4f6,
    roughness: 0.65,
  });
  const wallPositions: [number, number, number, number, number][] = [
    [0, 4, -30, 60, 8], // North (Kesultanan)
    [0, 4, 30, 60, 8],  // South (Acheh Institute)
    [-30, 4, 0, 8, 60], // West (Belantara)
    [30, 4, 0, 8, 60],  // East (Perang Semesta)
  ];
  wallPositions.forEach(([x, y, z, w, h]) => {
    const isEW = Math.abs(x) === 30;
    const wallGeo = isEW ? new THREE.BoxGeometry(1, h, 60) : new THREE.BoxGeometry(w, h, 1);
    const wall = new THREE.Mesh(wallGeo, wallMat);
    wall.position.set(x, y, z);
    scene.add(wall);

    // Warm Gold Picture Rail Frieze at top of walls
    const railMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.8, roughness: 0.25 });
    const railGeo = isEW ? new THREE.BoxGeometry(1.05, 0.15, 60) : new THREE.BoxGeometry(w, 0.15, 1.05);
    const rail = new THREE.Mesh(railGeo, railMat);
    rail.position.set(x, 7.2, z);
    scene.add(rail);

    // Sleek Architectural Baseboard at bottom of walls
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.4 });
    const baseGeo = isEW ? new THREE.BoxGeometry(1.04, 0.25, 60) : new THREE.BoxGeometry(w, 0.25, 1.04);
    const baseBoard = new THREE.Mesh(baseGeo, baseMat);
    baseBoard.position.set(x, 0.125, z);
    scene.add(baseBoard);
  });

  // Central Rotunda Dais: Monumen Kemerdekaan Halimon (Radiant Gold & Royal Lapis)
  const compassGeo = new THREE.CylinderGeometry(3.6, 3.9, 0.25, 8);
  const compassMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    metalness: 0.85,
    roughness: 0.2,
  });
  const compass = new THREE.Mesh(compassGeo, compassMat);
  compass.position.set(0, 0.12, 0);
  scene.add(compass);

  // Inset Lapis & Gold Star in dais
  const compassCenter = new THREE.Mesh(
    new THREE.CylinderGeometry(2.2, 2.2, 0.28, 32),
    new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.3, metalness: 0.4 })
  );
  compassCenter.position.set(0, 0.14, 0);
  scene.add(compassCenter);

  // Center Emblem: Dual Royal Lions & Crescent Star (Lambang Negara Aceh Sumatra)
  const centerArmillary = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const armRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.3, 0.05, 16, 36),
      new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.92, roughness: 0.15 })
    );
    armRing.rotation.set((i * Math.PI) / 3, (i * Math.PI) / 4, 0);
    centerArmillary.add(armRing);
  }
  // Central golden crescent star in monument
  const centerStar = new THREE.Mesh(
    new THREE.SphereGeometry(0.38, 24, 24),
    new THREE.MeshStandardMaterial({ color: 0xfffbeb, roughness: 0.15, metalness: 0.7 })
  );
  centerArmillary.add(centerStar);
  centerArmillary.position.set(0, 2.4, 0);
  scene.add(centerArmillary);

  // Upward Luminous Light Pillar in Center Monument
  const beaconPillar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.8, 7.6, 16),
    new THREE.MeshBasicMaterial({
      color: 0xfde047,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide,
    })
  );
  beaconPillar.position.set(0, 4.0, 0);
  scene.add(beaconPillar);

  // Modern Architectural Fluted White Columns with Brass Collars
  const columnPositions: [number, number][] = [
    [-6, -6], [-6, -14], [-6, -22],
    [6, -6], [6, -14], [6, -22],
    [-6, 6], [-6, 14], [-6, 22],
    [6, 6], [6, 14], [6, 22],
    [-14, -6], [-22, -6], [14, -6], [22, -6],
    [-14, 6], [-22, 6], [14, 6], [22, 6],
  ];
  const columnShaftMat = new THREE.MeshStandardMaterial({
    color: 0xfafafa,
    roughness: 0.22,
  });
  const columnBrassMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    metalness: 0.88,
    roughness: 0.2,
  });
  columnPositions.forEach(([cx, cz]) => {
    // Brass Base Plinth
    const colBase = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.25, 0.85), columnBrassMat);
    colBase.position.set(cx, 0.125, cz);

    // Pristine White Shaft
    const colShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 7.4, 24), columnShaftMat);
    colShaft.position.set(cx, 3.95, cz);

    // Mid Brass Accent Ring
    const colRing = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.035, 12, 24), columnBrassMat);
    colRing.position.set(cx, 4.0, cz);
    colRing.rotation.x = Math.PI / 2;

    // Brass Capital
    const colCap = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.25, 0.85), columnBrassMat);
    colCap.position.set(cx, 7.825, cz);

    scene.add(colBase, colShaft, colRing, colCap);
  });

  // ==========================================
  // LORONG WAKTU: Time Tunnel Portal Arches & Chrono Stream
  // ==========================================
  const timePortalArches: THREE.Mesh[] = [];

  // Config for each of the 4 Chronological Wings:
  // 1. North: Kesultanan (1607-1636) - Radiant Golden Amber
  // 2. East: Perang Semesta (1873-1911) - Energetic Ruby Coral
  // 3. South: Acheh Institute (1976-1979) - Electric Cyan Azure
  // 4. West: Belantara & Freedom (1979-1982) - Vibrant Emerald Mint
  const wingTimeConfigs = [
    { dir: 'north', colorHex: 0xf59e0b, secondaryHex: 0xfde047, axis: 'z', sign: -1, label: '1607 — 1636' },
    { dir: 'east', colorHex: 0xef4444, secondaryHex: 0xfca5a5, axis: 'x', sign: 1, label: '1873 — 1911' },
    { dir: 'south', colorHex: 0x0284c7, secondaryHex: 0x38bdf8, axis: 'z', sign: 1, label: '1976 — 1979' },
    { dir: 'west', colorHex: 0x10b981, secondaryHex: 0x6ee7b7, axis: 'x', sign: -1, label: '1979 — 1982' },
  ];

  wingTimeConfigs.forEach((wing) => {
    // Create 3 glowing time portal arches along each corridor (distance ~8m, ~16m, ~24m)
    [8, 16, 24].forEach((dist, archIdx) => {
      const isZ = wing.axis === 'z';
      const pos: [number, number, number] = isZ ? [0, 4.0, dist * wing.sign] : [dist * wing.sign, 4.0, 0];

      // Time Portal Arch Structure (Glowing neon arch frame)
      const archRadius = 4.2 - archIdx * 0.15;
      const archTube = 0.07;
      const archGeo = new THREE.TorusGeometry(archRadius, archTube, 16, 32, Math.PI);
      const archMat = new THREE.MeshBasicMaterial({
        color: archIdx % 2 === 0 ? wing.colorHex : wing.secondaryHex,
        transparent: true,
        opacity: 0.78,
      });
      const archMesh = new THREE.Mesh(archGeo, archMat);
      archMesh.position.set(...pos);
      if (!isZ) {
        archMesh.rotation.y = Math.PI / 2;
      }
      scene.add(archMesh);
      timePortalArches.push(archMesh);

      // Vertical Portal Light Pillars on left and right sides
      [-archRadius, archRadius].forEach((sideOffset) => {
        const pillarX = isZ ? sideOffset : pos[0];
        const pillarZ = isZ ? pos[2] : sideOffset;
        const beam = new THREE.Mesh(
          new THREE.CylinderGeometry(0.04, 0.04, 8, 12),
          new THREE.MeshBasicMaterial({ color: wing.secondaryHex, transparent: true, opacity: 0.55 })
        );
        beam.position.set(pillarX, 4.0, pillarZ);
        scene.add(beam);
      });
    });

    // Floor Time-Stream Neon Runner: Luminous guide ribbon running down the center of each corridor
    const isZ = wing.axis === 'z';
    const streamLen = 26;
    const streamGeo = isZ
      ? new THREE.PlaneGeometry(0.4, streamLen)
      : new THREE.PlaneGeometry(streamLen, 0.4);
    const streamMat = new THREE.MeshBasicMaterial({
      color: wing.colorHex,
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide,
    });
    const stream = new THREE.Mesh(streamGeo, streamMat);
    const streamCenter = 15 * wing.sign;
    stream.position.set(isZ ? 0 : streamCenter, 0.025, isZ ? streamCenter : 0);
    stream.rotation.x = -Math.PI / 2;
    scene.add(stream);

    // Warm Corridor Ambient Point Lights to bathe each corridor in inviting light
    [10, 20].forEach((d) => {
      const pLight = new THREE.PointLight(wing.colorHex, 1.6, 14, 1.8);
      pLight.position.set(isZ ? 0 : d * wing.sign, 4.5, isZ ? d * wing.sign : 0);
      scene.add(pLight);
    });
  });

  // Floating Chronos Time Particles ("Serbuk Waktu") - optimized count
  const particleCount = 120;
  const particleGeo = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);
  const particleColors = new Float32Array(particleCount * 3);

  const themePalette = [
    new THREE.Color(0xf59e0b), // Golden Kesultanan
    new THREE.Color(0xef4444), // Ruby Perang
    new THREE.Color(0x0284c7), // Cyan Acheh Institute
    new THREE.Color(0x10b981), // Emerald Freedom
    new THREE.Color(0xffedd5), // Warm Starlight
  ];

  for (let i = 0; i < particleCount; i++) {
    // Disperse within museum volume
    particlePositions[i * 3] = (Math.random() - 0.5) * 54;
    particlePositions[i * 3 + 1] = 0.5 + Math.random() * 6.8;
    particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 54;

    const chosenColor = themePalette[Math.floor(Math.random() * themePalette.length)];
    particleColors[i * 3] = chosenColor.r;
    particleColors[i * 3 + 1] = chosenColor.g;
    particleColors[i * 3 + 2] = chosenColor.b;
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

  const particleMat = new THREE.PointsMaterial({
    size: 0.18,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
  });
  const particleSystem = new THREE.Points(particleGeo, particleMat);
  scene.add(particleSystem);

  // Modern Frosted-Glass Wing Banners with Crisp Typography
  const createBanner = (text: string, sub: string, era: string, colorHex: number, pos: [number, number, number], rotY: number) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 320;
    const ctx = canvas.getContext('2d')!;

    // Modern bright frosted glass backdrop
    const grad = ctx.createLinearGradient(0, 0, 1024, 320);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    grad.addColorStop(1, 'rgba(248, 250, 252, 0.90)');
    ctx.fillStyle = grad;
    ctx.roundRect(10, 10, 1004, 300, 24);
    ctx.fill();

    // Vibrant Era Header Badge
    const hexStr = '#' + colorHex.toString(16).padStart(6, '0');
    ctx.fillStyle = hexStr;
    ctx.roundRect(40, 36, 260, 44, 14);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`LORONG ${era}`, 170, 67);

    // Modern border trim
    ctx.strokeStyle = hexStr;
    ctx.lineWidth = 6;
    ctx.roundRect(10, 10, 1004, 300, 24);
    ctx.stroke();

    // Wing Title
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 44px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(text.toUpperCase(), 40, 145);

    // Subtitle
    ctx.fillStyle = '#475569';
    ctx.font = '500 25px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(sub, 40, 205);

    // Chronology Tagline
    ctx.fillStyle = hexStr;
    ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('MENJELAJAHI SAKSI BISU SEJARAH • SENTUH ARTEFAK UNTUK INTERAKSI', 40, 260);

    const bannerTex = new THREE.CanvasTexture(canvas);
    const banner = new THREE.Mesh(
      new THREE.PlaneGeometry(6.8, 2.1),
      new THREE.MeshStandardMaterial({ map: bannerTex, roughness: 0.3, side: THREE.DoubleSide })
    );
    banner.position.set(...pos);
    banner.rotation.y = rotY;
    scene.add(banner);
  };

  createBanner('Sayap Kesultanan Aceh', 'Era Iskandar Muda & Kedaulatan Internasional', '1607 - 1636', 0xf59e0b, [-6, 6.2, -14], Math.PI / 2);
  createBanner('Perang Semesta 1873-1911', 'Syahidnya Kohler, Hikayat Prang Sabil & Dinasti Tiro', '1873 - 1911', 0xef4444, [6, 6.2, -14], -Math.PI / 2);
  createBanner('Acheh Institute & Deklarasi 1976', 'PBB New York Menuju Puncak Bukit Tjokkan', '1976 - 1979', 0x0284c7, [-6, 6.2, 14], Math.PI / 2);
  createBanner('Belantara & The Price of Freedom', 'Arsip Harian Hasan di Tiro & Stasiun Radio Rimba', '1979 - 1982', 0x10b981, [6, 6.2, 14], -Math.PI / 2);

  // Modern Museum Pedestals, Vitrines with Under-Glow & 3D Artifacts
  const pedestalMeshes = new Map<string, THREE.Group>();
  const waypointMeshes: THREE.Mesh[] = [];

  // Minimalist Gallery Matte White Plinth
  const pedestalPlinth = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.35 });
  const pedestalBrassBase = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.88, roughness: 0.2 });
  const pedestalTopMarble = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.15, metalness: 0.05 });
  // Lightweight Crisp Vitrine Display Case Material
  // MeshStandardMaterial with opacity bypasses heavy transmission framebuffer copies
  const glassMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.28,
    roughness: 0.08,
    metalness: 0.1,
  });

  const exhibitSpotlights: { spot: THREE.SpotLight; pos: [number, number, number] }[] = [];

  exhibits.forEach((exhibit) => {
    const [px, py, pz] = exhibit.pedestalPosition;
    const pGroup = new THREE.Group();
    pGroup.position.set(px, py, pz);
    pGroup.userData = { exhibitId: exhibit.id };

    // Brass Plinth Foot
    const foot = new THREE.Mesh(new THREE.BoxGeometry(1.68, 0.08, 1.68), pedestalBrassBase);
    foot.position.y = 0.04;
    foot.receiveShadow = true;
    pGroup.add(foot);

    // Sleek White Gallery Plinth
    const base = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.82, 1.6), pedestalPlinth);
    base.position.y = 0.45;
    base.castShadow = true;
    base.receiveShadow = true;
    pGroup.add(base);

    // Polished Pure White Marble Slab Top
    const top = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.08, 1.7), pedestalTopMarble);
    top.position.y = 0.90;
    top.receiveShadow = true;
    pGroup.add(top);

    // Glowing Neon Vitrine Rim Under-Glow
    const underGlow = new THREE.Mesh(
      new THREE.BoxGeometry(1.52, 0.04, 1.52),
      new THREE.MeshBasicMaterial({ color: exhibit.accentColor, transparent: true, opacity: 0.75 })
    );
    underGlow.position.y = 0.95;
    pGroup.add(underGlow);

    // Ultra-Clear Vitrine Display Case
    const vitrine = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.4, 1.5), glassMat);
    vitrine.position.y = 1.66;
    pGroup.add(vitrine);

    // Artifact 3D Geometry
    const artifact = createArtifactMesh(exhibit.meshType);
    artifact.position.y = 0.98;
    artifact.castShadow = true;
    pGroup.add(artifact);

    // Dedicated Bright Directional Spotlight (Optimized shadow: off by default to save 12 render passes)
    const spot = new THREE.SpotLight(exhibit.accentColor, 3.2, 11, Math.PI / 4.2, 0.4);
    spot.position.set(px, 6.8, pz);
    spot.target = top;
    spot.castShadow = false; // Turned off on spotlights; rotunda sun provides sharp realistic shadows for entire room
    scene.add(spot);
    exhibitSpotlights.push({ spot, pos: [px, py, pz] });

    // Luminous Floor Teleport / Interaction Halo Waypoint
    const haloGeo = new THREE.RingGeometry(1.3, 1.55, 24);
    const haloMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(exhibit.accentColor),
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7,
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.rotation.x = -Math.PI / 2;
    halo.position.set(px, 0.03, pz);
    halo.userData = { exhibitId: exhibit.id, isWaypoint: true };
    scene.add(halo);
    waypointMeshes.push(halo);

    scene.add(pGroup);
    pedestalMeshes.set(exhibit.id, pGroup);
  });

  // Central Rotunda Teleport Waypoint (Radiant Sunburst)
  const centerHalo = new THREE.Mesh(
    new THREE.RingGeometry(2.0, 2.35, 32),
    new THREE.MeshBasicMaterial({ color: 0xf59e0b, side: THREE.DoubleSide, transparent: true, opacity: 0.85 })
  );
  centerHalo.rotation.x = -Math.PI / 2;
  centerHalo.position.set(0, 0.03, 0);
  centerHalo.userData = { isCenterWaypoint: true };
  scene.add(centerHalo);
  waypointMeshes.push(centerHalo);

  // Raycasting & Interaction Setup
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let hoveredId: string | null = null;

  const onPointerMove = (e: PointerEvent) => {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const allInteractive = [...Array.from(pedestalMeshes.values()), ...waypointMeshes];
    const intersects = raycaster.intersectObjects(allInteractive, true);

    let foundId: string | null = null;
    for (const hit of intersects) {
      let obj: THREE.Object3D | null = hit.object;
      while (obj && obj !== scene) {
        if (obj.userData?.exhibitId) {
          foundId = obj.userData.exhibitId;
          break;
        }
        obj = obj.parent;
      }
      if (foundId) break;
    }

    if (foundId !== hoveredId) {
      hoveredId = foundId;
      onHoverExhibit(foundId);
      container.style.cursor = foundId ? 'pointer' : 'default';
    }
  };

  const onPointerDown = (e: PointerEvent) => {
    // Only trigger if clicking directly
    if (e.button !== 0) return;
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const allInteractive = [...Array.from(pedestalMeshes.values()), ...waypointMeshes];
    const intersects = raycaster.intersectObjects(allInteractive, true);

    for (const hit of intersects) {
      let obj: THREE.Object3D | null = hit.object;
      while (obj && obj !== scene) {
        if (obj.userData?.exhibitId) {
          onExhibitClick(obj.userData.exhibitId);
          return;
        }
        if (obj.userData?.isCenterWaypoint) {
          teleportTo([0, 1.6, 0]);
          return;
        }
        obj = obj.parent;
      }
    }
  };

  renderer.domElement.addEventListener('pointermove', onPointerMove);
  renderer.domElement.addEventListener('pointerdown', onPointerDown);

  // Resize Handler
  const handleResize = () => {
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };
  window.addEventListener('resize', handleResize);

  // Teleportation Smooth Tweening
  let targetCamPos: THREE.Vector3 | null = null;
  let targetLookAt: THREE.Vector3 | null = null;
  const currentLookAt = new THREE.Vector3(0, 1.6, -1);

  const teleportTo = (position: [number, number, number], lookAt?: [number, number, number]) => {
    targetCamPos = new THREE.Vector3(...position);
    if (lookAt) {
      targetLookAt = new THREE.Vector3(...lookAt);
    }
    if (onTeleportStart) {
      onTeleportStart(position, lookAt);
    }
  };

  // Animation Loop Update
  let time = 0;
  const update = (delta: number) => {
    time += delta;

    // Rotate center armillary monument slowly
    centerArmillary.rotation.y += delta * 0.25;

    // Pulse center beacon light pillar
    (beaconPillar.material as THREE.MeshBasicMaterial).opacity = 0.14 + Math.sin(time * 1.8) * 0.05;

    // Gently pulse time portal arches along the chronos corridors
    const archOpacity = 0.72 + Math.sin(time * 2.2) * 0.12;
    timePortalArches.forEach((arch) => {
      (arch.material as THREE.MeshBasicMaterial).opacity = archOpacity;
    });

    // Animate floating chronos particles
    particleSystem.rotation.y += delta * 0.03;
    const pPos = particleSystem.geometry.attributes.position;
    if (pPos) {
      // Subtle vertical shimmer
      const arr = pPos.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        arr[i * 3 + 1] += Math.sin(time * 2.0 + i) * 0.002;
      }
      pPos.needsUpdate = true;
    }

    // Gently pulse waypoint halos
    waypointMeshes.forEach((mesh, idx) => {
      const scale = 1.0 + Math.sin(time * 2.5 + idx) * 0.04;
      mesh.scale.set(scale, scale, 1);
    });

    // Smooth camera motion when teleporting
    if (targetCamPos) {
      camera.position.lerp(targetCamPos, 0.08);
      if (camera.position.distanceTo(targetCamPos) < 0.05) {
        camera.position.copy(targetCamPos);
        targetCamPos = null;
      }
    }

    if (targetLookAt) {
      currentLookAt.lerp(targetLookAt, 0.08);
      camera.lookAt(currentLookAt);
      if (currentLookAt.distanceTo(targetLookAt) < 0.05) {
        targetLookAt = null;
      }
    }

    // Dynamic Distance-based Spotlight Culling:
    // Only keep spotlights visible if player/camera is within 18 meters
    const camX = camera.position.x;
    const camZ = camera.position.z;
    for (let i = 0; i < exhibitSpotlights.length; i++) {
      const item = exhibitSpotlights[i];
      const dx = camX - item.pos[0];
      const dz = camZ - item.pos[2];
      const distSq = dx * dx + dz * dz;
      // In fast mode, keep closer threshold (12m), in balanced 18m, in high 26m
      const maxDistSq = currentQuality === 'fast' ? 144 : currentQuality === 'balanced' ? 324 : 676;
      item.spot.visible = distSq < maxDistSq;
    }

    renderer.render(scene, camera);
  };

  const setQuality = (quality: GraphicQuality) => {
    currentQuality = quality;
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;
    const pr = getQualityPixelRatio(quality);
    renderer.setPixelRatio(pr);
    renderer.setSize(w, h);

    if (quality === 'fast') {
      renderer.shadowMap.enabled = false;
      rotundaSun.castShadow = false;
      particleSystem.visible = false;
    } else if (quality === 'balanced') {
      renderer.shadowMap.enabled = true;
      rotundaSun.castShadow = true;
      particleSystem.visible = true;
    } else {
      renderer.shadowMap.enabled = true;
      rotundaSun.castShadow = true;
      particleSystem.visible = true;
    }
  };

  const getQuality = () => currentQuality;

  const cleanup = () => {
    window.removeEventListener('resize', handleResize);
    renderer.domElement.removeEventListener('pointermove', onPointerMove);
    renderer.domElement.removeEventListener('pointerdown', onPointerDown);
    if (renderer.domElement.parentElement) {
      renderer.domElement.parentElement.removeChild(renderer.domElement);
    }
    renderer.dispose();
  };

  return {
    scene,
    camera,
    renderer,
    pedestalMeshes,
    waypointMeshes,
    cleanup,
    update,
    teleportTo,
    isTeleporting: () => targetCamPos !== null,
    setQuality,
    getQuality,
  };
}
