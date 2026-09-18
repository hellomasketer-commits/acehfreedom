# Virtual Reality Museum Tour - Project Blueprint

## 1. Overview & Purpose
Virtual Reality Museum Tour is an immersive 3D WebXR and stereoscopic museum application. It allows users to explore classical architectural galleries, approach pedestals with interactive 3D historical artifacts, listen to rich voice-narrated audio guides with spatial acoustic feedback, and switch into stereoscopic or WebXR Virtual Reality mode.

## 2. Architecture & Design Principles
- **Rendering Engine**: Three.js WebGL rendering with real-time dynamic lighting, custom procedural 3D artifact models with PBR materials, normal/bump map details, shadows, and architectural museum halls.
- **VR Capabilities**:
  - WebXR `immersive-vr` session detection and activation.
  - Stereoscopic Split-Screen mode (side-by-side stereoscopy with interpupillary distance adjustment) for mobile VR headsets (Google Cardboard, BoboVR, etc.).
  - Gyroscope DeviceOrientation controls and smooth virtual joystick for mobile.
  - First-person WASD + Mouse look + Floor Waypoint teleportation navigation.
- **Audio System**:
  - Web Audio API procedural atmospheric museum reverb and historical ambient music (lyre, lute, flute, harp harmonic synthesizers).
  - Web Speech Synthesis API + Fallback curated voice narration for complete audio guides.
  - Interactive player with waveform visualization, playback speed adjustment, and synchronized transcript scroll.
- **Visual Design**:
  - Museum aesthetics: brushed bronze accents, midnight gallery marble, high-contrast typography, gallery wayfinding typography, and clear accessible controls.

## 3. Exhibits & Galleries
- **Ancient Egypt (Kemet Wing)**:
  - Tutankhamun's Golden Mask
  - Great Sphinx Relic & Cartouche
  - Rosetta Stone
  - Anubis Guardian Sarcophagus
- **Classical Antiquity (Greco-Roman Wing)**:
  - Winged Victory of Samothrace
  - Discobolus of Myron
  - Corinthian Black-Figure Amphora
  - Spartan Bronze Hoplite Helmet
- **Renaissance & Scientific Revolution**:
  - Da Vinci's Aerial Screw & Mechanical Flyer
  - Galileo's Celestial Telescope & Quadrant
  - Astrolabe of Flanders
  - Gutenberg Movable Type Printing Artifact
- **Mesoamerican & Pre-Columbian**:
  - Aztec Sun Calendar Monolith
  - Mayan Jade Death Mask of Pakal
  - Olmec Colossal Basalt Head
  - Quetzalcoatl Plumed Serpent Effigy

## 4. Current Implementation Steps (Phase 1)
- [x] Configure metadata, packages (three, @types/three), and HTML titles.
- [x] Define comprehensive TypeScript interfaces and Exhibit data (`src/types/museum.ts`, `src/data/exhibits.ts`).
- [x] Implement Procedural 3D Mesh Generator for rich historical artifacts and architectural museum gallery (`src/services/museum3d.ts`).
- [x] Implement Audio Guide & Web Audio Synthesizer service (`src/services/audioGuide.ts`).
- [x] Build 3D Museum Canvas with First-Person, Waypoint Teleport, and Stereoscopic VR Camera modes (`src/components/MuseumViewport.tsx`).
- [x] Build Artifact Inspector Modal with 360-degree rotation, layer inspection, and deep historical timeline (`src/components/ExhibitInspector.tsx`).
- [x] Build Curated Audio Player with live waveform, transcript, and voice selector (`src/components/AudioPlayerDrawer.tsx`).
- [x] Build Navigation HUD, Minimap radar, Guided Tour coordinator, and Visitor Passport (`src/components/MuseumControls.tsx`, `src/components/PassportModal.tsx`).
- [x] Assemble seamless main interface in `src/App.tsx` and verify with `compile_applet`.

## 5. Completed User Features
- **3D Museum Architecture**: Grand center rotunda with armillary sphere, checkered marble floors with procedural veins, classical Doric/Roman column colonnades, skylights, and focused directional spotlights.
- **12 Interactive Historical Exhibits**:
  - *Ancient Egypt*: Golden Mask of Tutankhamun, Rosetta Stone Stele, Anubis Jackal Guardian Shrine.
  - *Classical Antiquity*: Winged Victory of Samothrace, Corinthian Black-Figure Amphora, Spartan Bronze Hoplite Helmet.
  - *Renaissance*: Da Vinci's Aerial Screw Engine, Galileo's Celestial Refractor Telescope, Flemish Brass Astrolabe.
  - *Mesoamerica*: Aztec Sun Stone Monolith, Mayan Jade Funerary Mask of King Pakal, Olmec Colossal Basalt Head.
- **Virtual Reality Modes**:
  - *Stereoscopic VR Dual-Lens Mode*: Splits display into left and right optical channels for mobile VR headsets (Google Cardboard, etc.) with center divider and reticle alignment.
  - *WebXR Detection*: Connects with WebXR immersive-vr devices where supported.
  - *3D First-Person Navigation*: WASD / Arrow keys walk mode, click-and-drag 360° panoramic gaze, proximity detection triggers, and clickable floor teleport rings.
- **Audio Guides & Soundscapes**:
  - Web Speech synthesis narration with 3 curator personalities (Academic Curator, Master Storyteller, Archival Historian).
  - Web Audio API procedural atmospheric acoustics and historical music synthesis (Egyptian harp, Greek lyre, Renaissance lute, Mesoamerican flute).
  - Live audio player drawer with waveform scrubber, variable playback speed (0.75x–1.5x), and synchronized transcript reading drawer.
- **Curated Guided Tours**: Step-by-step automatic tours ("Grand Highlights of Human Civilization", "Treasures of Antiquity", "Cosmos & Sacred Skies").
- **Curator’s Visitor Passport**: Collectible archival stamps for each inspected artifact with historical date marks and completion tracking.
