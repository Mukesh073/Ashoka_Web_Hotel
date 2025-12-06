# Deploy to Vercel

## Steps:

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Login to Vercel:**
```bash
vercel login
```

3. **Deploy:**
```bash
vercel
```

4. **Add Environment Variables in Vercel Dashboard:**
   - Go to your project settings on vercel.com
   - Navigate to "Environment Variables"
   - Add: `MONGO_URI` = `mongodb+srv://hh:havana@cluster0.renncp4.mongodb.net/Ashoka_Hotel?retryWrites=true&w=majority`

5. **Redeploy after adding env variables:**
```bash
vercel --prod
```

## Alternative: Deploy via GitHub

1. Push code to GitHub
2. Go to vercel.com
3. Click "Import Project"
4. Select your GitHub repository
5. Add environment variable `MONGO_URI`
6. Deploy

Your site will be live at: `https://your-project-name.vercel.app`
