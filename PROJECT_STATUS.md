# 📝 État d'Avancement — DeShawn Carter : The Silent Rise

Ce document résume le travail effectué sur l'expérience immersive interactive de DeShawn Carter.

## 🚀 Stack Technique
- **Framework :** React (Vite) + TypeScript
- **Stylisation :** Tailwind CSS v4 (Thème ultra-dark & néon)
- **Animations :** Framer Motion (Transitions cinématiques)
- **3D :** Three.js (React Three Fiber / Drei)
- **Audio :** YouTube IFrame API (Intégration background music)

## 🎭 Lore & Narration
- **Protagoniste :** DeShawn Carter (27 ans), boss d'un empire silencieux à Los Santos.
- **Personnage Clé :** **Darius Reed**, frère d'armes (non biologique), tué lors d'un drive-by organisé par le père de DeShawn.
- **Trame :**
    - Enfance brisée à Oakland (famille d'accueil).
    - Retour violent chez la mère biologique (enfer de la drogue).
    - Fuite vers Los Santos après un double meurtre (Darius protège DeShawn).
    - Ascension criminelle et perte brutale de Darius à 26 ans.
    - Reconstruction d'un empire froid sous la façade d'une boîte de nuit.

## 🛠️ Fonctionnalités Implémentées

### 1. Introduction Cinématique (`IntroScreen.tsx`)
- Séquence de texte en fondu chronométrée.
- Ambiance mystérieuse posant les bases du récit.

### 2. Mode Récit Vertical (`ChapterSection.tsx`)
- Navigation par scroll avec indicateurs de chapitres.
- **Effets Immersifs :**
    - `glitch` : Tremblement du texte (traumatisme).
    - `bullets` : Impacts de balles dynamiques sur l'écran.
    - `blood` : Teinte rouge sang lors des moments tragiques.
    - `flash` : Éclats blancs simulant les coups de feu.
- **Fragments de mémoire :** Textes secrets révélés au survol avec lueur néon.

### 3. Archives 3D (`MemorySphere.tsx`)
- **Sphère interactive :** Navigation libre à 360° (OrbitControls).
- **Système de Verrouillage (Hard-Lock) :** 
    - La rotation et le flottement s'arrêtent net au survol d'un souvenir.
    - Extraction de données via pop-up haute définition (Glassmorphism).
- **Visuels :** Cœur neural pulsant, champ d'étoiles, et lignes de connexion.

### 4. Système Audio (`AudioPlayer.tsx`)
- Lecteur YouTube intégré (Backgound OST).
- **Contrôles :** Play/Pause animé, volume slider (0-100%), et mode muet.

## 🎨 Design System
- **Couleurs :**
    - Background : `#050505` (Ultra-black)
    - Primary : `#00f2ff` (Neon Blue)
    - Secondary : `#bc13fe` (Neon Purple)
- **Interface :** Glassmorphism, flous accentués, overlays de pluie et de grain (noise).

## 🏁 Prochaines Étapes suggérées
- Ajouter plus de Sound Effects (SFX) locaux pour les clics et transitions.
- Intégrer des visuels/images générés pour chaque chapitre en arrière-plan.
- Optimiser le chargement des ressources 3D.

---
*Projet prêt pour exploration et déploiement.*
