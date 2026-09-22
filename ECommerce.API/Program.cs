using ECommerce.API.Data;
using ECommerce.API.Services.Implementations;
using ECommerce.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.Extensions.Logging;
using System.Diagnostics;


// Git connection testimg

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AngularClient", policy =>
    {
        policy
            .WithOrigins("http://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<ICartService, CartService>();
builder.Services.AddScoped<IOrderService, OrderService>();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
    ));

builder.Services.AddOpenApi();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],

            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(
                    builder.Configuration["Jwt:Key"]!
                )
            )
        };
    });



builder.Services.AddAuthorization();

var app = builder.Build();


using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<AppDbContext>();
    var logger = services.GetRequiredService<ILogger<Program>>();

    // Detect if the app is running under IIS/IIS Express (in-process)
    var processName = Process.GetCurrentProcess().ProcessName?.ToLowerInvariant() ?? string.Empty;
    var isIisProcess = processName == "w3wp" || processName == "iisexpress";

    // Detect if the configured connection string targets LocalDB
    var conn = builder.Configuration.GetConnectionString("DefaultConnection") ?? string.Empty;
    var isLocalDb = conn.IndexOf("localdb", StringComparison.OrdinalIgnoreCase) >= 0 ||
                    conn.IndexOf("(localdb)", StringComparison.OrdinalIgnoreCase) >= 0;

    if (isIisProcess && isLocalDb)
    {
        // When hosted in IIS, LocalDB is often not accessible to the app pool identity.
        // Skip automatic migrations here to avoid crashing IIS on startup.
        logger.LogWarning("Skipping EF Core migrations because the app is running under IIS and the connection string targets LocalDB.");
    }
    else
    {
        try
        {
            // Apply any pending EF Core migrations so required tables (e.g., Users)
            // exist before running the seeder. This avoids "Invalid object name 'Users'".
            // It's safe in dev; in production consider running migrations separately.
            context.Database.Migrate();

            await DbSeeder.SeedAsync(context);
        }
        catch (Exception ex)
        {
            // Log startup errors so they are visible in the Event Viewer / stdout logs
            logger.LogError(ex, "An error occurred migrating or seeding the database.");

            // In Development do not rethrow to avoid crashing IIS during investigation.
            if (app.Environment.IsDevelopment())
            {
                logger.LogWarning("Environment is Development - swallowed startup exception to keep the host running for debugging.");
            }
            else
            {
                // In non-development environments, let the exception bubble so the host fails fast.
                throw;
            }
        }
    }
}

// Configure the HTTP request pipeline. 
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseCors("AngularClient");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
