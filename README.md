# Flashboard Demo Store

This open-source project demonstrates integrating [Flashboard](https://www.getflashboard.com) into a modern React stack. It showcases a naive e-commerce experience using Flashboard as a CMS and an admin panel. You can go to Flashboard and create a DEMO panel, which is used in this demo's [live version](https://demo.getflashboard.com).

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/seasonedcc/flashboard-demo.git
cd flashboard-demo
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Environment Variables

```bash
cp .env.sample .env
```

Edit the `.env` file to include your credentials:

- **S3 Configuration**:
  - `S3_ENDPOINT`
  - `S3_REGION`
  - `S3_ACCESS_KEY`
  - `S3_SECRET_KEY`

  These credentials can be obtained from providers like [Supabase](https://supabase.com/), [Amazon S3](https://aws.amazon.com/s3/), or [DigitalOcean Spaces](https://www.digitalocean.com/products/spaces).

- **PostgreSQL Configuration**:
  - `DATABASE_URL=postgres://user:password@localhost:5432/flashboard_demo`

  Ensure you've created a PostgreSQL database named `flashboard_demo` before proceeding.

### 4. Run Migrations and Seed the Database

```bash
pnpm run db:migrate
pnpm run db:seed
```

### 5. Start the Development Server

```bash
pnpm run dev
```

The application will be accessible at `http://localhost:5173`.

---

## 🧠 Exploring the Codebase

The primary goal of this repository is to illustrate how Flashboard can be integrated into your stack.

### Key Directories

- **`app/routes/`**: Contains route loaders and actions, showcasing data fetching and mutations using React Router v7.
- **`app/business/`**: Houses all the business logic, this is likely the folder you want to investigate.
- **`app/services/flashboard.server.ts`**: Illustrates how to fetch and display the images uploaded through Flashboard to your storage provider.
- **`app/db/`**: Contains database infrastructure, including Kysely setup, migration scripts, and connection configurations. You might want to investigate the migrations to see how we shaped the database to better work with Flashboard. The blog_posts table highlights some interesting features.

### References to libraries used in this repo

- [Zod](https://zod.dev/)
- [Composable Functions](https://github.com/seasonedcc/composable-functions)
- [Kysely](https://github.com/kysely-org/kysely)
- [Tailwind CSS](https://tailwindcss.com/)

The codebase includes comments to guide you through the implementation details.

---

## 📚 Learn More About Flashboard

- [Flashboard](https://www.getflashboard.com)
