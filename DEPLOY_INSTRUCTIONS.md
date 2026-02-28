# 🚀 Deployment Instructions

### 1. Run the Deploy Command
In your terminal, run:
```bash
vercel
```

### 2. Follow the Prompts
- **Set up and deploy?** [Y]
- **Which scope?** [Select your account]
- **Link to existing project?** [N]
- **Project Name:** `africano-smart-lock` (or your preference)
- **In which directory?** `./` (Just press Enter)
- **Want to modify these settings?** [N] (Our `vercel.json` handles it)

### 3. Critical: Environment Variables
Once the build starts, go to your **Vercel Dashboard** -> **Settings** -> **Environment Variables** and add:

1.  **DATABASE_URL**:postgresql://neondb_owner:npg_75hElOoIAcGK@ep-sparkling-brook-a8ee4hoz-pooler.eastus2.azure.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET=supersecretkey
    `postgresql://neondb_owner:npg_6yq...` (The full string)
    *Note: Enable "Automatically expose System Environment Variables" if needed, but explicit is better.*

2.  **JWT_SECRET**: (Create a strong secret or use the one from .env)
    `supersecretkey123`

### 4. Redeploy
After adding variables, run:
```bash
vercel --prod
```
to trigger a final production build with the new variables.
