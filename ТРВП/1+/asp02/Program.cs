using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using System.IO;

internal class Program
{
    private static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        var app = builder.Build();

        var defaultFilesOptions = new DefaultFilesOptions();
        defaultFilesOptions.DefaultFileNames.Clear();
        defaultFilesOptions.DefaultFileNames.Add("neumann.html");
        app.UseDefaultFiles(defaultFilesOptions);

        app.UseStaticFiles();

        app.UseStaticFiles(new StaticFileOptions
        {
            RequestPath = "/static"
        });

        app.UseStaticFiles(new StaticFileOptions
        {
            FileProvider = new PhysicalFileProvider(Path.Combine(builder.Environment.ContentRootPath, "picture")),
            RequestPath = "/images"
        });

        app.Run();
    }
}