#!/bin/bash

# Android APK Build Script for Menix App
# This script builds both debug and release APKs

echo "🚀 Building Menix Android App..."

# Build the web assets
echo "📦 Building web assets..."
npm run build

# Sync with Capacitor
echo "🔄 Syncing with Capacitor..."
npx cap sync android

# Build debug APK
echo "🔨 Building debug APK..."
cd android
./gradlew assembleDebug

# Build release APK
echo "🔨 Building release APK..."
./gradlew assembleRelease

# Show results
echo "✅ Build completed!"
echo ""
echo "📱 Generated APKs:"
echo "Debug APK:   android/app/build/outputs/apk/debug/app-debug.apk"
echo "Release APK: android/app/build/outputs/apk/release/app-release.apk"
echo ""
echo "📋 APK sizes:"
find . -name "*.apk" -type f -exec ls -lh {} \;
echo ""
echo "💡 For sharing via WhatsApp, use the release APK for better compatibility."
echo "💡 Make sure to enable 'Install from unknown sources' on target devices."

