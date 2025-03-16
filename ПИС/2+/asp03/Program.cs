using dal03;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.AspNetCore.StaticFiles;

internal class Program
{
    private static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        builder.Services.AddEndpointsApiExplorer();
        var app = builder.Build();

        app.UseHttpsRedirection();

        var provider = new FileExtensionContentTypeProvider();
        provider.Mappings[".jpg"] = "image/jpeg";
        provider.Mappings[".png"] = "image/png";
        provider.Mappings[".json"] = "application/json";

        app.UseStaticFiles(new StaticFileOptions
        {
            FileProvider = new PhysicalFileProvider(Path.Combine(builder.Environment.ContentRootPath, "wwwroot")),
            RequestPath = "/Celebrities",
            ContentTypeProvider = provider,
            OnPrepareResponse = ctx =>
            {
                ctx.Context.Response.Headers.Append("Cache-Control", "public, max-age=3600"); // Кеширование на 1 час
                ctx.Context.Response.Headers.Append("Content-Disposition", "attachment"); // Принудительное скачивание файлов
            }
        });

        app.UseDirectoryBrowser(new DirectoryBrowserOptions
        {
            FileProvider = new PhysicalFileProvider(Path.Combine(builder.Environment.ContentRootPath, "wwwroot")),
            RequestPath = "/Celebrities/download"
        });

        Repository.JSONFileName = "Celebrities.json";

        using (IRepository repository = new Repository("wwwroot"))
        {
            app.MapGet("/Celebrities", () => repository.GetAllCelebrities());
            app.MapGet("/Celebrities/{id:int}", (int id) => repository.GetCelebrityById(id));
            app.MapGet("/Celebrities/BySurname/{surname}", (string surname) => repository.GetCelebritiesBySurname(surname));
            app.MapGet("/Celebrities/PhotoPathById/{id:int}", (int id) => repository.GetPhotoPathById(id));
            app.MapGet("/Photo/{filename}", (string filename) =>
            {
                var filePath = Path.Combine(builder.Environment.ContentRootPath, "wwwroot", filename);
                if (System.IO.File.Exists(filePath))
                {
                    return Results.File(filePath, provider.Mappings[Path.GetExtension(filename)]);
                }
                return Results.NotFound();
            });
        }

        app.Run();
    }
}