using System.Security.Cryptography;
using Wordapp;
using Npgsql;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
  
    options.AddPolicy("AllowLocalhost63342", policy =>
    {
        policy.WithOrigins("http://localhost:63342")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// 
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors("AllowLocalhost63342"); 

app.UseDefaultFiles(); 
app.UseStaticFiles(); 



app.Use(async (context, next) =>
{
    const string clientIdCookieName = "ClientId";

    if (!context.Request.Cookies.TryGetValue(clientIdCookieName, out var clientId))
    {
        clientId = GenerateUniqueClientId();
        context.Response.Cookies.Append(clientIdCookieName, clientId, new CookieOptions
        {
            HttpOnly = true, 
            Secure = false,  // For dev over HTTP
            SameSite = SameSiteMode.Strict,
            MaxAge = TimeSpan.FromDays(365) // Cookie expiration
        });
        Console.WriteLine($"New client ID generated and set: {clientId}");
    }
    else
    {
        Console.WriteLine($"Existing client ID found: {clientId}");
    }
    await next();
});

static string GenerateUniqueClientId()
{
    using var rng = RandomNumberGenerator.Create();
    var bytes = new byte[16];
    rng.GetBytes(bytes);
    return Convert.ToBase64String(bytes);
}

Actions actions = new(app);

app.Run();
