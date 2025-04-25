using Microsoft.Extensions.Options;
using DAL_Celebrity_MSSQL;
using Microsoft.AspNetCore.Http;
using System.IO;
using Microsoft.AspNetCore.Builder;
using DAL_Celebrity;

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

        var app = builder.Build();

        app.UseMiddleware<ExceptionHandlingMiddleware>();

        app.UseDefaultFiles();
        app.UseStaticFiles();

        var celebrities = app.MapGroup("/api/Celebrities");

        celebrities.MapGet("/", (IRepository<Celebrity, Lifeevent> repo) => repo.GetAllCelebrities());
        celebrities.MapGet("/{id:int:min(1)}", (IRepository<Celebrity, Lifeevent> repo, int id) => repo.GetCelebrityById(id));
        celebrities.MapGet("/Lifeevents/{id:int:min(1)}", (IRepository<Celebrity, Lifeevent> repo, int id) => repo.GetCelebrityByLifeeventId(id));
        celebrities.MapDelete("/{id:int:min(1)}", (IRepository<Celebrity, Lifeevent> repo, int id) => repo.DelCelebrity(id));
        celebrities.MapPost("/", (IRepository<Celebrity, Lifeevent> repo, Celebrity celebrity) => repo.AddCelebrity(celebrity));
        celebrities.MapPut("/{id:int:min(1)}", (IRepository<Celebrity, Lifeevent> repo, int id, Celebrity celebrity) => repo.UpdCelebrity(id, celebrity));
        celebrities.MapGet("/photo/{fname}", async (IOptions<CelebritiesConfig> config, HttpContext context, string fname) =>
        {
            var photoPath = Path.Combine(config.Value.PhotosFolder, fname);
            if (File.Exists(photoPath))
            {
                var bytes = await File.ReadAllBytesAsync(photoPath);
                context.Response.ContentType = "image/jpeg";
                await context.Response.Body.WriteAsync(bytes);
            }
            else
            {
                context.Response.StatusCode = StatusCodes.Status404NotFound;
            }
        });

        var lifeevents = app.MapGroup("/api/Lifeevents");

        lifeevents.MapGet("/", (IRepository<Celebrity, Lifeevent> repo) => repo.GetAllLifeevents());
        lifeevents.MapGet("/{id:int:min(1)}", (IRepository<Celebrity, Lifeevent> repo, int id) => repo.GetLifeevetById(id));
        lifeevents.MapGet("/Celebrities/{id:int:min(1)}", (IRepository<Celebrity, Lifeevent> repo, int id) => repo.GetLifeeventsByCelebrityId(id));
        lifeevents.MapDelete("/{id:int:min(1)}", (IRepository<Celebrity, Lifeevent> repo, int id) => repo.DelLifeevent(id));
        lifeevents.MapPost("/", (IRepository<Celebrity, Lifeevent> repo, Lifeevent lifeevent) => repo.AddLifeevent(lifeevent));
        lifeevents.MapPut("/{id:int:min(1)}", (IRepository<Celebrity, Lifeevent> repo, int id, Lifeevent lifeevent) => repo.UpdLifeevent(id, lifeevent));

        celebrities.MapGet("/testError", (IRepository<Celebrity, Lifeevent> repo) =>
        {
            throw new Exception("Тест ошибки.");
        });

        app.Run();
    }
}

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext httpContext)
    {
        try
        {
            await _next(httpContext);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unexpected error occurred");
            httpContext.Response.StatusCode = StatusCodes.Status500InternalServerError;
            httpContext.Response.ContentType = "application/json";
            await httpContext.Response.WriteAsync((
                error: "An unexpected error occurred.",
                details: ex.Message
            ).ToString());
        }
    }
}