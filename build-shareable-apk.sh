#!/bin/bash

# Build Shareable APK Script for Menix App
# This script builds a debug APK and prepares it for sharing

echo "🚀 Building Shareable APK for Menix App..."

# Build the web assets
echo "📦 Building web assets..."
cd /home/mohit/Desktop/menix
npm run build

# Sync with Capacitor
echo "🔄 Syncing with Capacitor..."
npx cap sync android

# Build debug APK (which is working correctly)
echo "🔨 Building debug APK..."
cd android
./gradlew clean assembleDebug

# Create a shareable version
echo "📱 Creating shareable APK..."
cp app/build/outputs/apk/debug/app-debug.apk app/build/outputs/apk/debug/menix-shareable.apk

# Show results
echo "✅ Build completed!"
echo ""
echo "📱 Shareable APK:"
echo "Location: android/app/build/outputs/apk/debug/menix-shareable.apk"
echo "Size: $(ls -lh app/build/outputs/apk/debug/menix-shareable.apk | awk '{print $5}')"
echo ""
echo "💡 Instructions for sharing:"
echo "1. Copy the APK file to your target device"
echo "2. Enable 'Install from unknown sources' on the target device"
echo "3. Install the APK file"
echo ""
echo "⚠️  Note: This is a debug build, which is perfectly fine for testing and sharing."
echo "   The release build has a known issue that we're working on fixing."


