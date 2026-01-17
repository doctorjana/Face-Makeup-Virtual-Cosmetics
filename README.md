# Face Makeup - Virtual Cosmetics

A modern, high-performance virtual makeup application built with Vanilla JS and MediaPipe Face Mesh. Apply realistic cosmetic effects like lipstick, eyeliner, eyeshadow, blush, and skin smoothing in real-time.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Deployment](https://github.com/USER_OR_ORG/REPO_NAME/actions/workflows/deploy.yml/badge.svg)

## Features

- **Realistic Makeup Effects**: Subtly blended cosmetics that respect facial geometry.
- **Skin Smoothing**: High-quality skin refinement with texture preservation.
- **Face Zoom**: Focused view for precise makeup application.
- **Original Comparison**: Quickly toggle between the original image and current makeup.
- **High-Resolution Export**: Export your final look as PNG or JPEG at original image dimensions.
- **Modern UI**: Dark-themed, responsive interface with smooth animations and glassmorphism.

## Local Development

To run the project locally:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/USER_OR_ORG/REPO_NAME.git
   cd REPO_NAME
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

## Deployment

This project is configured for automatic deployment to **GitHub Pages** via GitHub Actions.

- **Workflow**: Every push to the `main` branch triggers the `.github/workflows/deploy.yml` action.
- **Static Assets**: All paths are relative, making it compatible with GitHub Pages' subdirectory structure (e.g., `user.github.io/repo/`).

## Technologies Used

- **MediaPipe Face Landmarker**: 468-point 3D facial landmark detection.
- **HTML5 Canvas**: High-performance image processing and rendering.
- **Vanilla JavaScript**: Lightweight and fast application core.
- **CSS3**: Modern styling with Flexbox, CSS Grid, and Backdrop Filters.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
