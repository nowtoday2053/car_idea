# GitHub Repository Setup Guide

## Step 1: Create Repository on GitHub

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Repository name: `car-price-checker` (or your preferred name)
5. Description: "Professional web application to check if cars are overpriced using market data analysis"
6. Choose **Public** or **Private**
7. **DO NOT** initialize with README, .gitignore, or license (we already have these)
8. Click "Create repository"

## Step 2: Connect Local Repository to GitHub

After creating the repository on GitHub, run these commands in your terminal:

```powershell
cd "c:\Users\mario\OneDrive\Desktop\car idea"
git remote add origin https://github.com/YOUR_USERNAME/car-price-checker.git
git branch -M main
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username.**

## Alternative: Using SSH (if you have SSH keys set up)

```powershell
cd "c:\Users\mario\OneDrive\Desktop\car idea"
git remote add origin git@github.com:YOUR_USERNAME/car-price-checker.git
git branch -M main
git push -u origin main
```

## Step 3: Verify

After pushing, refresh your GitHub repository page. You should see all your files there!

## Important Notes

- Your `.env` file is already in `.gitignore` - it won't be pushed (this is good for security)
- Make sure to add your environment variables in Vercel when deploying
- The `env.example` file shows what environment variables are needed

