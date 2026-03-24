# KECAP SUMPUT - Pangandaran Edition

A thrilling local multiplayer word-guessing party game built with React Native and Expo. Gather your friends, assign the roles, and find out who is blending in and who is completely clueless!

## Table of Contents
- [About the Game](#about-the-game)
- [Player Roles](#player-roles)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Installation and Setup](#installation-and-setup)
- [How to Play](#how-to-play)
- [Copyright and License](#copyright-and-license)

## About the Game
Kecap Sumput (Hidden Word) is a digital tabletop game designed for 4 to 20 players. Inspired by classic social deduction games, this app provides a seamless offline party experience where players pass a single device around to view their secret roles and words, discuss, and vote out the impostors. 

This special "Pangandaran Edition" features local culture, vocabulary, and specific themes to make the gameplay even more engaging.

## Player Roles
* **Marlin (Civilian):** Receives the actual secret word. Your goal is to find out who the Banteng and Lutung are without making the word too obvious.
* **Banteng (Undercover):** Receives a word very similar to the Marlin's word. Your goal is to blend in, mimic the civilians, and survive the voting phase.
* **Lutung (Mr. White):** Receives no word at all. Your goal is to listen carefully to the hints, survive the votes, or successfully guess the Marlin's secret word if you get eliminated.

## Key Features
* **Multi-Language Support:** Play natively in Sundanese, Indonesian, or English.
* **Dynamic Scoring System:** Automated points calculation based on survivability, elimination penalties, and a massive comeback jackpot for Lutung.
* **Player Profiles:** Snap a quick selfie using the device camera for your player avatar before the round begins.
* **Interactive Photobooth:** Take group photos after a match with an automated leaderboard overlay generated directly on the image.
* **Social Sharing:** Export and share your scoreboard and photobooth results directly to social media platforms.
* **Fluid Animations:** Smooth card flips, shaking effects on elimination, and confetti drops to enhance the gaming experience.

## Tech Stack
* React Native
* Expo (EAS Build)
* Expo Camera & AV (Audio/Video Integration)
* React Native View Shot (For exporting leaderboards)
* Async Storage (For local claim validations)

## Installation and Setup
To run this project locally on your machine for development or testing, follow these steps:

1. Clone the repository:
   git clone https://github.com/yourusername/kecap-sumput.git

2. Navigate to the project directory:
   cd kecap-sumput

3. Install dependencies:
   npm install

4. Start the Expo development server:
   npx expo start

5. Scan the generated QR code using the Expo Go app on your Android or iOS device.

## How to Play
1. Set the total number of players, Banteng (Undercovers), and Lutung (Mr. Whites).
2. Input player names and capture profile pictures.
3. Pass the phone around. Each player taps to reveal their secret word and role, then taps again to hide it before passing to the next person.
4. Once everyone has seen their role, the discussion phase begins. Each player gives one short hint about their word.
5. Vote for the player you suspect is the Banteng or Lutung.
6. If Lutung is eliminated, they have one final chance to type and guess the secret word to steal the victory and claim the ultimate score!

## Copyright and License
Powered by Reand Technology.

Copyright (c) 2026 Andre Putra Pratama. All Rights Reserved.
This project is proprietary. Unauthorized copying, modification, or distribution of this software is strictly prohibited.