## CMS Deployment At `/admin`

### 1. Build frontend

```bash
cd "/home/imageuser/Template /Azea-Typescript"
npm install
npm run build
```

The app is configured with:

- Vite `base = /admin/`
- React Router `basename = /admin`

### 2. Copy build output to a stable serve path

Do not serve directly from the template path with a space in the directory name.

Recommended:

```bash
mkdir -p /home/imageuser/cms-admin-dist
rsync -a --delete "/home/imageuser/Template /Azea-Typescript/dist/" /home/imageuser/cms-admin-dist/
```

### 3. Nginx location

Add this inside the `image.cloudon.gr` server block:

```nginx
location /admin/ {
    alias /home/imageuser/cms-admin-dist/;
    try_files $uri $uri/ /admin/index.html;
}
```

### 4. Reload nginx

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### 5. Open CMS

```text
https://image.cloudon.gr/admin/
```

### Notes

- Public API stays at `/api/...`
- CMS auth/backend endpoints stay under `/cms/...`
- `/admin` is frontend only
