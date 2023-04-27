<div id="top"></div>

<br />
<div align="center">
  <a href="https://github.com/babakjalilian/poker">
    <img src="src/textures/card_image.png" alt="Logo" width="150" height="100">
  </a>

  <h3 align="center">Texas Hold 'em</h3>

  <p align="center">
    Bet on the go in one of the most popular types of poker!
    <br />
    <a href="https://babakjalilian.github.io/poker/">View Demo</a>
    ·
    <a href="https://64490d38c9d380ea6fbfb8a6-qyyygmgvbh.chromatic.com/">View Storybook</a>
    ·
    <a href="https://github.com/babakjalilian/poker/issues">Report Bug</a>
  </p>
</div>

[![Github Action and Chromatic](https://github.com/babakjalilian/poker/actions/workflows/ci.yml/badge.svg)](https://github.com/babakjalilian/poker/actions/workflows/ci.yml)
[![license](http://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat)](LICENSE)

## About the Project

Texas Hold \'em is a popular version of Poker played by two people or more. The rules are complex, especially when it comes to pot sharing. Yet, the game tries to use a short but efficient logic in winner-determination and sharing the pot, if needed. You can see the rules [here](https://en.wikipedia.org/wiki/Texas_hold_'em#Rules "Texas Hold 'em rules").
This online application is a [Hotseat](https://en.wikipedia.org/wiki/Hotseat_%28multiplayer_mode%29 'Hotseat') implementation of the game, meant to be played locally. In a Hotseat version, players take turns playing on the same device.

### Built with

- [React](https://reactjs.org/)
- [TypeScript](https://typescriptlang.org/)
- [MobX](https://mobx.js.org/README.html 'MobX')

## Getting Started

### Prerequisites

- [Node.js v18](https://nodejs.org/en/download/) (and [npm](https://www.npmjs.com/))
- TypeScript v5 or later

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/babakjalilian/poker.git
   ```
2. Navigate into the local repository and install NPM packages (might take a few minutes).

   ```sh
   npm install
   ```

3. Run `npm run start` to start a dev server. Navigate to `http://localhost:5173/`. The page will automatically reload if you change any code in the source files.

### Test

Navigate into the local repository, then:

- use the following command to run unit tests:
  ```sh
   npm run test
  ```
- use the following command to run UI tests on Storybook:
  ```sh
   npm run storybook
  ```

### Lint

- use the following command to fix esLint errors:
  ```sh
   npm run lint:fix
  ```

### Production and Deployment

- use the following command to build application:
  ```sh
   npm run build
  ```
- use the following command to build storybook:
  ```sh
   npm run build-storybook
  ```
- This repository is using GitHub Actions for the build and deployment.
  (From `main` to the `github-pages` branch.)
  Application and storybook deployment is automated and will be updated every time you push to ` main` branch, but you can deploy storybook manually using the following command:

```sh
   npm run chromatic
```

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

## Contact

### Babak Jalilian

Email: babakjalilian1990@gmail.com

LinkedIn: https://www.linkedin.com/in/babak-jalilian/
