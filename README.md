# 🎯 Aim Trainer Pro

<div align="center">
  
<img width="721" height="689" alt="image" src="https://github.com/user-attachments/assets/e19958ff-a9c8-4b64-918e-002798902c4f" />
  
  **A browser-based mouse accuracy trainer with advanced analytics, 4 game modes, and real-time cursor path visualization.**

[▸ Play Online](https://online-aim-trainer.vercel.app/) · [Screenshots](#-screenshots) · [Getting Started](#-getting-started)

</div>

---

## 📖 About

Aim Trainer Pro is an interactive tool designed to help you improve your mouse aiming precision. The app tracks your cursor movement, analyzes path linearity, measures reaction time, and evaluates hit accuracy — all running entirely in the browser with zero backend dependencies.

### Tracked Metrics

| Metric | Description |
|--------|-------------|
| **Score** | Points earned per hit (zone-based: +1 / +2 / +5) |
| **Accuracy** | Percentage of successful hits out of total clicks |
| **Avg Reaction** | Average reaction time between consecutive hits (ms) |
| **Linearity** | How straight your cursor path was to the target (%) |
| **Zone Breakdown** | Distribution of hits across target zones |

---

## 🎮 Game Modes

| Mode | Description |
|------|-------------|
| 🎯 **Classic** | One target at a time. Click fast and aim true. |
| ⚡ **Speed** | 3 simultaneous targets. Destroy them all before time runs out! |
| 💎 **Precision** | Targets shrink over time. Aim for the center! |
| 👁️ **Reflex** | Targets appear and vanish quickly. Test your reflexes. |

---

## ✨ Features

- **4 unique game modes** with distinct mechanics
- **Customizable settings** — duration (10–120s), target size (40–140px)
- **Real-time cursor path visualization** — color-coded from green (straight) to red (deviated)
- **Ideal path overlay** — dashed line showing the shortest route to the target
- **Grade system** — earn a rating from D to S+ after each round
- **Synthesized sound effects** — built with Web Audio API (no external audio files)
- **Animated hit feedback** — floating score popups (+1, +2, +5) with color coding
- **Responsive design** — works at any screen size
- **Zero backend dependencies** — builds to a single HTML file

---

## 📸 Screenshots

<details>
<summary>Expand screenshots</summary>

### Main Menu
<img width="1654" height="877" alt="image" src="https://github.com/user-attachments/assets/10c48de8-5f1f-4d60-9149-d6986ee04367" />


### Gameplay
<img width="1885" height="896" alt="image" src="https://github.com/user-attachments/assets/8174f1b2-e12c-4802-9bcf-0d574ac1db79" />

### Results Screen
<img width="1198" height="859" alt="image" src="https://github.com/user-attachments/assets/ed872235-ef48-4c26-b53c-f5cd70db5bc6" />

</details>

---

## 🎯 Scoring System

Each target is composed of three concentric zones:

```
┌─────────────────┐
│  Outer Ring (+1) │
│  ┌───────────┐  │
│  │ Middle(+2)│  │
│  │  ┌─────┐  │  │
│  │  │ ●+5 │  │  │
│  │  └─────┘  │  │
│  └───────────┘  │
└─────────────────┘
```

| Zone | Points | Radius |
|------|--------|--------|
| Center (inner) | +5 | ≤ 25% of target size |
| Middle | +2 | ≤ 55% of target size |
| Outer | +1 | ≤ 100% of target size |
| Miss | 0 | — |

### Grade System

| Grade | Requirement |
|-------|-------------|
| **S+** | ≥ 100 points and ≥ 90% accuracy |
| **S** | ≥ 70 points and ≥ 80% accuracy |
| **A** | ≥ 50 points and ≥ 70% accuracy |
| **B** | ≥ 30 points and ≥ 60% accuracy |
| **C** | ≥ 15 points and ≥ 40% accuracy |
| **D** | Everything else |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **npm** 9+ (or yarn / pnpm)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/aim-trainer-pro.git
cd aim-trainer-pro

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
```

The output will be at `dist/index.html` — a self-contained single-page application that can be opened locally or deployed to any static hosting.

### Preview Build

```bash
npm run preview
```
---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

```
MIT License

Copyright (c) 2025

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

<div align="center">

**Built with ❤️ and Claude Opus 4.6**

If you found this useful — give it a ⭐

</div>
