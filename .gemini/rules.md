# Workflow Rules

## Git & Deployment Protocol
1. **GitHub Push on Every Change**:
   - Every single time any code, asset, or configuration changes are made and approved/requested, automatically commit and push them to GitHub (`origin main`).
2. **Vercel Deployments**:
   - **DO NOT** deploy to Vercel or update the live website (`arjunaayush.tech`) automatically.
   - Only trigger a deployment to Vercel when the user explicitly instructs to **"deploy"** or **"deploy to vercel"**.
