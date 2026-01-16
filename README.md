# Contact Management System

Web system for contact management built with ASP.NET Core MVC featuring user authentication and role-based access control.

## Features

- **User authentication** with login and password
- **Two access profiles**: Administrator and Standard
- **Contact management**: create, edit, view and delete personal contacts
- **User management** (administrators only): register and manage other users
- **Password recovery** via email
- **Password change** for logged users
- **Paginated listings** with search and sorting using DataTables

## Technologies

- ASP.NET Core 8 MVC
- Entity Framework Core
- SQL Server
- Bootstrap 5
- jQuery & DataTables
- Newtonsoft.Json

## How to Run

### Prerequisites

- .NET 8 SDK
- SQL Server (LocalDB, Express or full version)

### Steps

1. Clone the repository
2. Configure the connection string in `appsettings.json`
3. Run migrations: `dotnet ef database update`
4. Insert the initial admin user by running this SQL:
```sql
   INSERT INTO Usuarios (Nome, Login, Email, Perfil, Senha, DataCadastro)
   VALUES ('Administrador', 'admin', 'admin@admin.com', 1, 
   '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', GETDATE())
```
5. Run the project: `dotnet run`
6. Access: `https://localhost:5001` (or configured port)
7. Login: `admin` | Password: `123456`

## Email Configuration

To use password recovery, configure SMTP credentials in `appsettings.json`:
```json
"SMTP": {
  "Host": "smtp.gmail.com",
  "Port": 587,
  "UserName": "your-email@gmail.com",
  "Senha": "your-app-password",
  "Nome": "Contact System"
}
```

## Project Structure
```
ControleDeContatos/
├── Controllers/      # MVC Controllers
├── Data/            # EF Context and mapping
├── Filters/         # Authentication filters
├── Helper/          # Helper classes (session, email, encryption)
├── Models/          # Data models
├── Repositorio/     # Data access layer
├── Views/           # Razor views
└── wwwroot/         # Static files
```

## License

This project is free to use for educational purposes.
