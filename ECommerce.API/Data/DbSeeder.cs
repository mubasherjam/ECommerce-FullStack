using ECommerce.API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.API.Data
{
    public static class DbSeeder
    {
        public static async Task SeedAsync(AppDbContext context)
        {
            // Create Admin if it doesn't exist
            if (!await context.Users.AnyAsync(u => u.Email == "admin@ecommerce.com"))
            {
                var admin = new User
                {
                    FirstName = "Admin",
                    LastName = "User",
                    Email = "admin@ecommerce.com",
                    Role = "Admin"
                };

                var passwordHasher = new PasswordHasher<User>();

                admin.PasswordHash = passwordHasher.HashPassword(
                    admin,
                    "Admin123!"
                );

                context.Users.Add(admin);
            }

            // Create Customer if it doesn't exist
            if (!await context.Users.AnyAsync(u => u.Email == "customer@ecommerce.com"))
            {
                var customer = new User
                {
                    FirstName = "Test",
                    LastName = "Customer",
                    Email = "customer@ecommerce.com",
                    Role = "Customer"
                };

                var passwordHasher = new PasswordHasher<User>();

                customer.PasswordHash = passwordHasher.HashPassword(
                    customer,
                    "Customer123!"
                );

                context.Users.Add(customer);
            }

            await context.SaveChangesAsync();

            // Seed categories and products only on a fresh database
            if (!await context.Categories.AnyAsync())
            {
                var electronics = new Category { Name = "Electronics", Description = "Gadgets, audio, and computing gear" };
                var clothing = new Category { Name = "Clothing", Description = "Everyday and outdoor apparel" };
                var homeAndKitchen = new Category { Name = "Home & Kitchen", Description = "Appliances and essentials for the home" };
                var books = new Category { Name = "Books", Description = "Fiction, non-fiction, and reference" };
                var sportsAndOutdoors = new Category { Name = "Sports & Outdoors", Description = "Fitness and outdoor equipment" };

                context.Categories.AddRange(
                    electronics, clothing, homeAndKitchen, books, sportsAndOutdoors
                );

                await context.SaveChangesAsync();

                var products = new List<Product>
                {
                    // Electronics
                    new Product
                    {
                        Name = "Wireless Noise-Cancelling Headphones",
                        Description = "Over-ear Bluetooth headphones with active noise cancellation and 30-hour battery life.",
                        Price = 179.99m,
                        StockQuantity = 42,
                        ImageUrl = "https://picsum.photos/seed/headphones/600/600",
                        CategoryId = electronics.Id
                    },
                    new Product
                    {
                        Name = "4K Ultra HD Smart TV 55\"",
                        Description = "55-inch 4K smart TV with HDR support and built-in streaming apps.",
                        Price = 549.00m,
                        StockQuantity = 15,
                        ImageUrl = "https://picsum.photos/seed/smarttv/600/600",
                        CategoryId = electronics.Id
                    },
                    new Product
                    {
                        Name = "Mechanical Gaming Keyboard",
                        Description = "RGB backlit mechanical keyboard with hot-swappable switches.",
                        Price = 89.50m,
                        StockQuantity = 60,
                        ImageUrl = "https://picsum.photos/seed/keyboard/600/600",
                        CategoryId = electronics.Id
                    },

                    // Clothing
                    new Product
                    {
                        Name = "Slim Fit Denim Jacket",
                        Description = "Classic slim fit denim jacket made from durable washed cotton.",
                        Price = 64.99m,
                        StockQuantity = 35,
                        ImageUrl = "https://picsum.photos/seed/denimjacket/600/600",
                        CategoryId = clothing.Id
                    },
                    new Product
                    {
                        Name = "Merino Wool Sweater",
                        Description = "Soft, breathable merino wool crewneck sweater for everyday wear.",
                        Price = 79.00m,
                        StockQuantity = 28,
                        ImageUrl = "https://picsum.photos/seed/woolsweater/600/600",
                        CategoryId = clothing.Id
                    },
                    new Product
                    {
                        Name = "Everyday Running Sneakers",
                        Description = "Lightweight running shoes with cushioned soles for daily training.",
                        Price = 94.99m,
                        StockQuantity = 50,
                        ImageUrl = "https://picsum.photos/seed/sneakers/600/600",
                        CategoryId = clothing.Id
                    },

                    // Home & Kitchen
                    new Product
                    {
                        Name = "Stainless Steel French Press",
                        Description = "34oz double-walled French press for rich, full-flavor coffee.",
                        Price = 39.95m,
                        StockQuantity = 70,
                        ImageUrl = "https://picsum.photos/seed/frenchpress/600/600",
                        CategoryId = homeAndKitchen.Id
                    },
                    new Product
                    {
                        Name = "12-Piece Non-Stick Cookware Set",
                        Description = "Durable non-stick pots and pans set, dishwasher safe.",
                        Price = 149.99m,
                        StockQuantity = 20,
                        ImageUrl = "https://picsum.photos/seed/cookware/600/600",
                        CategoryId = homeAndKitchen.Id
                    },
                    new Product
                    {
                        Name = "Robot Vacuum Cleaner",
                        Description = "Smart robot vacuum with app control and automatic docking.",
                        Price = 229.00m,
                        StockQuantity = 18,
                        ImageUrl = "https://picsum.photos/seed/robotvacuum/600/600",
                        CategoryId = homeAndKitchen.Id
                    },

                    // Books
                    new Product
                    {
                        Name = "The Last Signal",
                        Description = "A science fiction novel about the final message from a dying star system.",
                        Price = 16.99m,
                        StockQuantity = 90,
                        ImageUrl = "https://picsum.photos/seed/lastsignal/600/600",
                        CategoryId = books.Id
                    },
                    new Product
                    {
                        Name = "Kitchen Alchemy: Everyday Recipes",
                        Description = "A cookbook of approachable recipes for home cooks of all skill levels.",
                        Price = 24.99m,
                        StockQuantity = 55,
                        ImageUrl = "https://picsum.photos/seed/kitchenalchemy/600/600",
                        CategoryId = books.Id
                    },
                    new Product
                    {
                        Name = "Focus & Flow: A Guide to Deep Work",
                        Description = "Practical strategies for building focus and doing meaningful work.",
                        Price = 19.99m,
                        StockQuantity = 65,
                        ImageUrl = "https://picsum.photos/seed/focusflow/600/600",
                        CategoryId = books.Id
                    },

                    // Sports & Outdoors
                    new Product
                    {
                        Name = "Adjustable Dumbbell Set",
                        Description = "Space-saving adjustable dumbbells, 5 to 52.5 lbs per hand.",
                        Price = 299.00m,
                        StockQuantity = 12,
                        ImageUrl = "https://picsum.photos/seed/dumbbells/600/600",
                        CategoryId = sportsAndOutdoors.Id
                    },
                    new Product
                    {
                        Name = "2-Person Camping Tent",
                        Description = "Waterproof, easy-setup tent for backpacking and weekend trips.",
                        Price = 119.99m,
                        StockQuantity = 25,
                        ImageUrl = "https://picsum.photos/seed/campingtent/600/600",
                        CategoryId = sportsAndOutdoors.Id
                    },
                    new Product
                    {
                        Name = "Yoga Mat with Carrying Strap",
                        Description = "Extra-thick non-slip yoga mat with a strap for easy carrying.",
                        Price = 29.99m,
                        StockQuantity = 80,
                        ImageUrl = "https://picsum.photos/seed/yogamat/600/600",
                        CategoryId = sportsAndOutdoors.Id
                    }
                };

                context.Products.AddRange(products);

                await context.SaveChangesAsync();
            }
        }
    }
}