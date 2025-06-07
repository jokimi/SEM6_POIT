using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using DAL_Celebrity;
using DAL_Celebrity_MSSQL;
using Microsoft.Extensions.Options;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;

namespace ASP08_DLL
{
    public static class CelebritiesAPExtensions
    {
        public static void AddCelebritiesConfiguration(this WebApplicationBuilder builder)
        {
            builder.Configuration
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("Celebrities.config.json");

            builder.Services.Configure<CelebritiesConfig>(builder.Configuration.GetSection("Celebrities"));
        }

        public static void AddCelebritiesServices(this WebApplicationBuilder builder)
        {
            builder.Services.Configure<CelebritiesConfig>(builder.Configuration.GetSection("Celebrities"));
            builder.Services.AddSingleton<CountryCodes>(provider =>
            {
                var config = provider.GetRequiredService<IOptions<CelebritiesConfig>>().Value;
                var env = provider.GetRequiredService<IWebHostEnvironment>();
                var fullPath = Path.Combine(env.ContentRootPath, config.CountryCodesPath);
                if (!File.Exists(fullPath))
                {
                    throw new FileNotFoundException($"Файл с кодами стран не найден по пути: {fullPath}");
                }
                var json = File.ReadAllText(fullPath);
                return JsonSerializer.Deserialize<CountryCodes>(json) ??
                       throw new InvalidOperationException("Не удалось десериализовать коды стран");
            });
            builder.Services.AddSingleton<CelebrityTitles>();
            builder.Services.AddScoped<IRepository<Celebrity, Lifeevent>>(_ =>
                Repository.Create(builder.Configuration.GetValue<string>("Celebrities:ConnectionString")));
        }

        public static void UseANCErrorHandler(this IApplicationBuilder app, string errorCodePrefix)
        {
            app.Use(async (context, next) =>
            {
                try
                {
                    await next();
                }
                catch (Exception ex)
                {
                    context.Response.StatusCode = 500;
                    await context.Response.WriteAsync($"{errorCodePrefix}-ERROR: {ex.Message}");
                }
            });
        }

        public static void MapCelebrities(this WebApplication app)
        {
            app.MapGet("/api/celebrities", (IRepository<Celebrity, Lifeevent> repo) =>
            {
                var list = repo.GetAllCelebrities();
                return Results.Ok(list);
            });
        }

        public static void MapLifeevents(this WebApplication app)
        {
            app.MapGet("/api/lifeevents", (IRepository<Celebrity, Lifeevent> repo) =>
            {
                var list = repo.GetAllLifeevents();
                return Results.Ok(list);
            });
        }

        public static void MapPhotoCelebrities(this WebApplication app)
        {
            app.MapGet("/api/photos/{id}", (int id, IRepository<Celebrity, Lifeevent> repo) =>
            {
                var celeb = repo.GetCelebrityById(id);
                return celeb?.ReqPhotoPath != null
                    ? Results.File(celeb.ReqPhotoPath, "image/jpeg")
                    : Results.NotFound();
            });
        }
    }
}