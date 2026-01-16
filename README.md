# Contact Management System

Simple web app for managing contacts with user authentication and role-based permissions. Built with ASP.NET Core MVC because sometimes you just need something straightforward that works.

![.NET 8.0](https://img.shields.io/badge/.NET-8.0-512BD4?logo=dotnet)
![SQL Server](https://img.shields.io/badge/SQL%20Server-CC2927?logo=microsoft-sql-server&logoColor=white)
![Bootstrap 5](https://img.shields.io/badge/Bootstrap-5-7952B3?logo=bootstrap&logoColor=white)

## What it does

This is basically a digital address book with user management. You can:

- Log in with username and password
- Store contacts (name, email, phone)
- Edit or delete your contacts
- Search through your contacts
- Recover your password via email if you forget it
- Change your password anytime

If you're an admin, you also get to:
- Create and manage other users
- Delete users
- See everyone's contacts (if you really need to)

## Why I built this

Needed a practical example of ASP.NET Core MVC with Entity Framework and proper authentication. Most tutorials are either too simple (hello world) or too complex (full-blown enterprise app). This sits right in the middle - real enough to be useful, simple enough to understand.

Also wanted to practice DataTables integration and proper password hashing without using Identity (sometimes you don't need all that overhead).

## Tech stack

- **ASP.NET Core 8 MVC** - The framework
- **Entity Framework Core** - Database ORM
- **SQL Server** - Database (works with LocalDB, Express, or full version)
- **Bootstrap 5** - UI styling
- **jQuery + DataTables** - Interactive tables with search/sort/pagination
- **SHA-256** - Password hashing (yeah, not BCrypt - keep reading)

## Quick start

### What you need

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- SQL Server (LocalDB is fine)
- An SMTP account if you want password recovery to work

### Installation

**1. Clone it**
```bash
git clone https://github.com/yourusername/contact-management.git
cd contact-management
```

**2. Set up the database**

Edit `appsettings.json` with your SQL Server connection:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=ContactsDB;Trusted_Connection=True;"
  }
}
```

For SQL Express, use something like:
```json
"DefaultConnection": "Server=localhost\\SQLEXPRESS;Database=ContactsDB;Trusted_Connection=True;TrustServerCertificate=True;"
```

**3. Create the database**
```bash
dotnet ef database update
```

This runs the migrations and creates all tables.

**4. Add the admin user**

Open SSMS or Azure Data Studio and run:

```sql
USE ContactsDB;

INSERT INTO Usuarios (Nome, Login, Email, Perfil, Senha, DataCadastro)
VALUES ('Administrator', 'admin', 'admin@example.com', 1, 
        '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 
        GETDATE());
```

This creates an admin user with:
- **Username**: `admin`
- **Password**: `123456`
- **Profile**: Administrator (1)

The password hash is SHA-256 of "123456". Yeah, I know SHA-256 isn't ideal for passwords - see the notes section below.

**5. Run it**
```bash
dotnet run
```

Navigate to `https://localhost:5001` (or whatever port it tells you).

**6. Log in**

Use `admin` / `123456` to log in as administrator.

## Email setup (optional)

If you want password recovery to work, configure SMTP in `appsettings.json`:

```json
{
  "SMTP": {
    "Host": "smtp.gmail.com",
    "Port": 587,
    "UserName": "your-email@gmail.com",
    "Senha": "your-app-password",
    "Nome": "Contact System"
  }
}
```

**For Gmail:**
1. Enable 2FA on your Google account
2. Generate an App Password at https://myaccount.google.com/apppasswords
3. Use that app password (not your regular password)

Without SMTP configured, password recovery won't work, but everything else will.

## How to use

### As a regular user

1. Log in with your credentials
2. Click "Contacts" to see your list
3. Click "New Contact" to add someone
4. Use the search box to filter contacts
5. Click edit/delete icons to manage contacts
6. Use "Change Password" in the menu to update your password

### As an administrator

Everything a regular user can do, plus:

1. Access "Users" menu
2. Create new users (choose Standard or Administrator profile)
3. Edit or delete existing users
4. Administrators can see all contacts (by default - you might want to change this)

## User profiles explained

There are two profiles:

- **Standard (0)**: Regular users who can only manage their own contacts
- **Administrator (1)**: Can manage users and has full system access

These are defined in the `PerfilEnum`:
```csharp
public enum PerfilEnum
{
    Standard = 0,
    Administrator = 1
}
```

## Project structure

```
ControleDeContatos/
├── Controllers/
│   ├── ContatoController.cs      # Contact CRUD operations
│   ├── UsuarioController.cs      # User management (admin only)
│   ├── LoginController.cs        # Authentication
│   └── AlterarSenhaController.cs # Password change
├── Data/
│   ├── BancoContext.cs           # EF Core context
│   └── Map/                      # Entity configurations
├── Filters/
│   └── PaginaParaUsuarioLogado.cs # Auth filter
├── Helper/
│   ├── ISessao.cs                # Session management
│   ├── IEmail.cs                 # Email sending
│   └── Criptografia.cs           # Password hashing
├── Models/
│   ├── UsuarioModel.cs           # User entity
│   └── ContatoModel.cs           # Contact entity
├── Repositorio/
│   ├── IUsuarioRepositorio.cs    # User repository interface
│   └── IContatoRepositorio.cs    # Contact repository interface
└── Views/
    ├── Contato/                  # Contact views
    ├── Usuario/                  # User management views
    ├── Login/                    # Login/password recovery views
    └── Shared/                   # Layouts and partials
```

## Key features breakdown

### Session management

Uses `IHttpContextAccessor` to manage user sessions. When you log in, your user object is serialized to JSON and stored in the session. The `PaginaParaUsuarioLogado` filter checks this on protected pages.

### Password hashing

Passwords are hashed with SHA-256 before storing. The `Criptografia` helper handles this:

```csharp
public static string GerarHash(string valor)
{
    using (SHA256 sha256Hash = SHA256.Create())
    {
        byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(valor));
        return Convert.ToBase64String(bytes);
    }
}
```

**Important**: SHA-256 is not the best choice for passwords (use BCrypt, Argon2, or PBKDF2 in production), but it works for demo purposes.

### Email recovery

When you click "Forgot Password":
1. System generates a random password
2. Hashes it and updates the database
3. Sends the new password via email
4. User logs in with the new password and should change it immediately

### DataTables integration

Contact and user lists use DataTables for:
- Client-side searching
- Column sorting
- Pagination
- Responsive design

Configuration is in the views:
```javascript
$('#table-contacts').DataTable({
    language: {
        url: '//cdn.datatables.net/plug-ins/1.11.5/i18n/en.json'
    }
});
```

## Customization tips

### Adding new contact fields

1. Add properties to `ContatoModel.cs`
2. Update the mapping in `ContatoMap.cs`
3. Create a migration: `dotnet ef migrations add AddFieldToContact`
4. Update the database: `dotnet ef database update`
5. Update the forms in `Views/Contato/`

### Changing session timeout

In `Program.cs`:

```csharp
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30); // Change this
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});
```

### Adding more user profiles

Update `PerfilEnum` and add role checks in controllers/views where needed.

## Things to know

### About password security

The app uses SHA-256 for password hashing. This is **not recommended for production**. Use BCrypt, Argon2, or ASP.NET Core Identity instead. I kept it simple for learning purposes, but don't deploy this to production without upgrading the password hashing.

### About SQL injection

Entity Framework handles parameterization, so you're protected against SQL injection as long as you're using LINQ queries. Don't build raw SQL strings from user input.

### About XSS

Razor automatically HTML-encodes output, so you're mostly protected. But if you use `@Html.Raw()`, make sure you trust the content.

## Possible improvements

- [ ] Switch to BCrypt or Argon2 for password hashing
- [ ] Add profile pictures for contacts
- [ ] Export contacts to CSV/Excel
- [ ] Import contacts from file
- [ ] Add contact groups/categories
- [ ] Add pagination server-side (DataTables can handle it)
- [ ] Add audit logging (who did what when)
- [ ] Two-factor authentication
- [ ] API endpoints (turn it into a REST API too)
- [ ] Unit tests

## Troubleshooting

**Database connection fails**
- Check your connection string
- Make sure SQL Server service is running
- Try `sqlcmd -S localhost\SQLEXPRESS -E` to test connection

**Password recovery doesn't work**
- Verify SMTP configuration
- Check spam folder
- For Gmail, make sure you're using an App Password, not your account password
- Check application logs for SMTP errors

**Login keeps redirecting to login page**
- Check if sessions are enabled in `Program.cs`
- Clear browser cookies
- Check if `UseSession()` is called before `UseEndpoints()` in middleware pipeline

## Contributing

This is a learning project, but feel free to fork it and make it better. Pull requests are welcome if you want to add features or fix bugs.

## License

MIT License - do whatever you want with this code.
---

Built this to learn ASP.NET Core MVC and Entity Framework. If you're learning too, hope this helps. The code is intentionally simple and well-commented.
