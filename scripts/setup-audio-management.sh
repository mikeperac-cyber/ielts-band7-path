#!/bin/bash
# Setup script to install git hooks and configure audio file management
# Run: bash scripts/setup-audio-management.sh

set -e

echo "🎵 Setting up audio file management..."
echo ""

# 1. Update .gitignore if needed
echo "1️⃣  Configuring .gitignore..."
if ! grep -q 'public/audio' .gitignore 2>/dev/null; then
    echo "/public/audio/*.mp3" >> .gitignore
    echo "   ✅ Added audio files to .gitignore"
else
    echo "   ✅ Audio files already in .gitignore"
fi

# 2. Setup Git LFS (if installed)
echo ""
echo "2️⃣  Checking Git LFS..."
if command -v git-lfs &> /dev/null; then
    echo "   ✅ Git LFS found"
    if ! git config filter.lfs.smudge &> /dev/null; then
        echo "   Installing Git LFS configuration..."
        git lfs install
        echo "   ✅ Git LFS installed"
    else
        echo "   ✅ Git LFS already configured"
    fi
else
    echo "   ⚠️  Git LFS not installed (optional)"
    echo "   To use Git LFS for audio files, install it: https://git-lfs.github.com/"
fi

# 3. Install pre-commit hook
echo ""
echo "3️⃣  Installing pre-commit hook..."
HOOK_DIR=".git/hooks"
HOOK_FILE="$HOOK_DIR/pre-commit"

if [ -d "$HOOK_DIR" ]; then
    if [ -f "scripts/pre-commit" ]; then
        cp scripts/pre-commit "$HOOK_FILE"
        chmod +x "$HOOK_FILE"
        echo "   ✅ Pre-commit hook installed"
    else
        echo "   ⚠️  scripts/pre-commit not found"
    fi
else
    echo "   ⚠️  .git/hooks directory not found"
fi

echo ""
echo "✅ Audio file management setup complete!"
echo ""
echo "Next steps:"
echo "  1. Review AUDIO_MANAGEMENT.md for storage options"
echo "  2. Choose a storage solution (Git LFS, S3, Supabase, etc.)"
echo "  3. Migrate existing audio files to your chosen storage"
echo "  4. Update code to fetch audio from the new location"
echo ""
echo "The pre-commit hook will prevent accidental audio file commits."
echo "GitHub Actions will also check for audio files in PRs."
