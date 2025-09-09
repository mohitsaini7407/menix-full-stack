#!/bin/bash

# Script to fix Java version compatibility issues after capacitor sync
echo "🔧 Fixing Java version compatibility..."

# Fix capacitor.build.gradle
echo "📝 Updating android/app/capacitor.build.gradle..."
sed -i 's/JavaVersion.VERSION_21/JavaVersion.VERSION_17/g' android/app/capacitor.build.gradle

# Fix capacitor-android module
echo "📝 Updating capacitor-android module..."
sed -i 's/JavaVersion.VERSION_21/JavaVersion.VERSION_17/g' node_modules/@capacitor/android/capacitor/build.gradle

# Fix capacitor-app module
echo "📝 Updating capacitor-app module..."
sed -i 's/JavaVersion.VERSION_21/JavaVersion.VERSION_17/g' node_modules/@capacitor/app/android/build.gradle

echo "✅ Java version compatibility fixed!"
echo "🚀 You can now build your Android app with: cd android && ./gradlew assembleDebug"
