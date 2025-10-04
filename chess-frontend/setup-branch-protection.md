# Branch Protection Setup Guide

## GitHub CLI Setup (if you have GitHub CLI installed)

```bash
# Install GitHub CLI if not already installed
# https://cli.github.com/

# Authenticate with GitHub
gh auth login

# Enable branch protection for main branch
gh api repos/:owner/:repo/branches/main/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":[]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"required_approving_review_count":1}' \
  --field restrictions=null
```

## Manual Setup Steps

### GitHub Web Interface:
1. Go to your repository
2. Settings → Branches
3. Add rule for `main` branch
4. Enable required protections

### GitLab Web Interface:
1. Go to your project
2. Settings → Repository → Protected branches
3. Protect `main` branch
4. Set appropriate permissions

## Current Repository Status
- Branch: `main`
- Status: Clean working tree
- Last commit: `d08d0cc`
- Protection: Local hook installed