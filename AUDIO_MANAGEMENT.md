# Audio File Management Guide

This project contains multiple MP3 audio files for IELTS practice exercises. To keep the repository size manageable, audio files should **not** be committed directly to Git.

## Current Setup

Audio files are gitignored and should be managed through one of the following methods:

### Option 1: Git LFS (Recommended for small teams)
If you have Git LFS installed, audio files can be tracked with LFS:

```bash
# Install Git LFS (if not already installed)
git lfs install

# Track MP3 files with Git LFS
git lfs track "*.mp3"
```

### Option 2: External Storage (Recommended for production)
Host audio files on a CDN or cloud storage:

- **AWS S3** — Cost-effective, scalable
- **Cloudflare R2** — Affordable, fast global distribution
- **Supabase Storage** — Already mentioned in .gitignore, great for authenticated access
- **Vercel Blob** — Seamless integration with Vercel deployments

### Option 3: Generate on Build
If audio files are generated or fetched from an API:

- Add a build step to download files from an external source
- Update your deployment scripts to fetch audio during build/deploy

## Setup Instructions

### For Git LFS:
```bash
git lfs install
git lfs track "*.mp3"
git add .gitattributes
git commit -m "chore: configure Git LFS for audio files"
```

### For External Storage (S3 example):
1. Upload audio files to S3
2. Update code to fetch from S3 URLs
3. Example: `https://your-bucket.s3.amazonaws.com/audio/intro.mp3`

### For Supabase (already referenced):
```bash
# Upload via Supabase dashboard or SDK
# Reference in code: https://your-project.supabase.co/storage/v1/object/public/audio/intro.mp3
```

## Next Steps

1. Choose a storage method above
2. Remove binary audio files from Git history (see below)
3. Update your code to fetch audio from the chosen source

## Removing Audio Files from Git History

To clean up the repository and remove previously committed audio files:

```bash
# Option A: Using git filter-repo (recommended)
git filter-repo --path public/audio --invert-paths

# Option B: Using BFG Repo-Cleaner
bfg --delete-folders public/audio

# After cleanup, force push (be careful!)
git push origin --force --all
git push origin --force --tags
```

**⚠️ Warning:** Force pushing rewrites history. Notify collaborators before doing this.

## File Size Impact

Current commit includes ~70+ MP3 files. Removing them from history will significantly reduce:
- Repository clone time
- Disk space requirements
- Push/pull performance

## Questions?

Refer to the official docs:
- [Git LFS Documentation](https://git-lfs.github.com/)
- [AWS S3 Setup](https://docs.aws.amazon.com/s3/)
- [Supabase Storage](https://supabase.com/docs/guides/storage)
