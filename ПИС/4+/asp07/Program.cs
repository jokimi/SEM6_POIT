using DAL_Celebrity_MSSQL;
using Microsoft.EntityFrameworkCore;
using ASP07_DLL;
using static ASP07_DLL.CelebritiesAPExtensions;
using DAL_Celebrity;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.FileProviders.Physical;

internal class Program
{
    private static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        builder.Configuration.AddJsonFile("Celebrities.config.json", optional: false, reloadOnChange: true);
        builder.Services.Configure<CelebritiesConfig>(builder.Configuration.GetSection("Celebrities"));
        builder.Services.AddScoped<IRepository<Celebrity, Lifeevent>, Repository>((sp) =>
        {
            var config = sp.GetRequiredService<IOptions<CelebritiesConfig>>().Value;
            return new Repository(config.ConnectionString);
        });

        builder.Services.AddRazorPages();
        builder.Services.AddRazorPages(options =>
        {
            options.Conventions.AddPageRoute("/Celebrities", "/");
            options.Conventions.AddPageRoute("/NewCelebrity", "/new");
            options.Conventions.AddPageRoute("/Celebrity", "/celebrities/{id:int:min(1)}");
            options.Conventions.AddPageRoute("/Celebrity", "/{id:int:min(1)}");
        });

        builder.Services.AddSession();

        builder.Services.AddLogging(logging => {
            logging.AddConsole();
            logging.AddDebug();
        });

        var app = builder.Build();
        app.UseStaticFiles();
        app.UseStaticFiles(new StaticFileOptions
        {
            FileProvider = new PhysicalFileProvider(
        Path.Combine(builder.Environment.WebRootPath, "temp")),
            RequestPath = "/temp"
        });

        if (!app.Environment.IsDevelopment())
        {
            app.UseExceptionHandler("/Error");
            app.UseHsts();
        }

        app.UseRouting();

        app.UseSession();
        app.MapRazorPages();

        app.MapCelebrities();
        app.MapLifeevents();
        app.MapPhotoCelebrities();

        app.Run();
    }
}