#!/bin/bash

# CreditGo EAS Update Script
# Run this script to publish updates to all platforms
# Usage: ./update.sh "Your update message"

# Check if user is logged in
if ! eas whoami &> /dev/null; then
    echo "❌ Not logged in to EAS. Please run 'eas login' first."
    exit 1
fi

# Get message from argument or use default
MESSAGE="${1:-Update}"

echo "🚀 Publishing EAS Update: $MESSAGE"
echo ""

# Run the update in the background if requested
if [ "$2" = "--background" ] || [ "$2" = "-b" ]; then
    echo "📦 Running update in background..."
    eas update --branch production --message "$MESSAGE" &
    UPDATE_PID=$!
    echo "✅ Update started (PID: $UPDATE_PID)"
    echo "📊 You can check progress with: wait $UPDATE_PID"
    echo ""
    echo "🔗 Once complete, share this URL with friends:"
    echo "   https://expo.dev/accounts/creditgo/projects/creditgo/updates"
else
    eas update --branch production --message "$MESSAGE"
fi

echo ""
echo "✅ Update published successfully!"
echo ""
echo "📱 Friends will receive the update automatically when they open the app."
echo "🔗 Share the build link (from eas build) - updates work over-the-air!"
