# Task Manager Server

## Deployment

- **Live Link**: [Live server link](https://task-management-server-eight-khaki.vercel.app)

## Postman API Documentation:

- **[Postman API Documentation]()**

## Technologies Used

- TypeScript
- Express
- Prisma
- MongoDB
- Bcrypt
- Zod

## Getting Started

To get a local copy of the project up and running, follow these steps:

1. **Clone the Repository:**

```shell
git clone <repository-link>
```

2. **Navigate to the Project Directory:**

```shell
cd <project_name>
```

3. Please update the filename from `.env.example` to `.env` and Fill your own data

4. **Install Dependencies:**

```shell
pnpm i
```

or

```shell
yarn
```

or

```shell
npm i
```

5. **Generate Prisma:**

```shell
npx prisma generate
```

6. **Generate migration:**

```shell
npx prisma db push
for prod
npx prisma migrate deploy
```

7. **Start the Server:**

```shell
pnpm dev
```

or

```shell
yarn dev
```

or

```shell
npm run dev
```

The server will be running at **`http://localhost:5000`** .

## Contributing

Contributions are welcome! If you find any bugs or want to suggest improvements, please open an issue or create a pull request.

## License

Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## More Projects and Information

👉 Explore additional projects and find out more about my work on my portfolio website: [Md Mobassher Hossain](https://mobassher.vercel.app)
