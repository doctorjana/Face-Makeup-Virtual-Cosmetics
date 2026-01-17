# Face Makeup - Virtual Cosmetics

A modern, high-performance virtual makeup application built with Vanilla JS and MediaPipe Face Mesh. Apply realistic cosmetic effects like lipstick, eyeliner, eyeshadow, blush, and skin smoothing in real-time.

[**Live Preview**](https://doctorjana.github.io/Face-Makeup-Virtual-Cosmetics/)

## Comparisons

| Before | After |
| :---: | :---: |
| ![Before](src/sample/before.jpg) | ![After](src/sample/after.jpg) |

## Key Features

### 💋 Lip Cosmetics
- **Customizable Lipstick**: Choose from a wide range of colors or use the color picker for a custom shade.
- **Advanced Blending**: Choose between 'Natural' (soft light), 'Darken' (multiply), or 'Vibrant' (overlay) blend modes to match any look.
- **Precision Opacity**: Fine-tune the intensity of the lip color for a subtle or bold appearance.

### 👁️ Eye Enhancements
- **Multi-Style Eyeliner**: Toggle between 'Simple', 'Winged', and 'Thick' styles to define the eyes.
- **Eyeshadow Palette**: Apply vibrant eyeshadows with adjustable opacity for layered looks.
- **Customizable Eye Colors**: Full control over the colors used for eyeliner and eyeshadow.

### ✨ Face & Skin Refinement
- **Intelligent Skin Smoothing**: Smooths skin while preserving natural texture and pores using high-pass filtering.
- **Blush & Contour**: Realistic blush application and sophisticated contouring/highlighting to enhance facial structure.
- **Auto-Face Zoom**: Special precision mode that crops and zooms exactly to the face for detailed editing.
- **Original Comparison**: Tap the 'Show Original' button at any time to see your progress.

### 📥 High-Quality Export
- **Original Resolution**: Exports the final image at the exact resolution of the original upload, not just a screen capture.
- **Format Options**: Save your work in high-quality **PNG** or optimized **JPEG** formats.
- **No Watermarks**: Professional output suitable for sharing or further editing.

### 🤖 AI-Powered Technology
- **MediaPipe Face Mesh**: Utilizes Google's state-of-the-art 468-point 3D facial landmark detection.
- **Real-Time Processing**: Efficient canvas-based rendering ensures smooth interaction even with large images.

## Local Development

To run the project locally:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/doctorjana/Face-Makeup-Virtual-Cosmetics.git
   cd Face-Makeup-Virtual-Cosmetics
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```
   The application will be available at `http://localhost:3000`.

## Technologies Used

- **MediaPipe Face Landmarker**: High-fidelity facial tracking.
- **HTML5 Canvas**: Dynamic image manipulation.
- **Vanilla JavaScript**: Lightweight, framework-free performance.
- **Modern CSS**: Glassmorphism, animations, and responsive layout.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
