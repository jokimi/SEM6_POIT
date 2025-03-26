using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using dal05;
using Microsoft.AspNetCore.Diagnostics;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

// Установка файла JSON, который используется репозиторием
Repository.JSONFileName = "Celebrities.json";

// Создание экземпляра репозитория
using (IRepository repository = new Repository("Celebrities"))
{
    // Обработчик ошибок
    app.UseExceptionHandler("/Celebrities/Error");

    // Получить всех знаменитостей (GET /Celebrities)
    app.MapGet("/Celebrities", () => repository.GetAllCelebrities());

    // Получить знаменитость по ID (GET /Celebrities/{id})
    app.MapGet("/Celebrities/{id:int}", (int id) =>
    {
        Celebrity? celebrity = repository.GetCelebrityById(id);
        if (celebrity == null)
            throw new FoundByIdException($"Celebrity Id = {id}");
        return celebrity;
    });

    // Добавить новую знаменитость (POST /Celebrities)
    app.MapPost("/Celebrities", (Celebrity celebrity) =>
    {
        int? id = repository.AddCelebrity(celebrity);
        if (id == null)
            throw new AddCelebrityException("POST /Celebrities error, id == null");

        if (repository.SaveChanges() <= 0)
            throw new SaveException("/Celebrities error, SaveChanges() <= 0");

        return new Celebrity((int)id, celebrity.Firstname, celebrity.Surname, celebrity.PhotoPath);
    })
    .AddEndpointFilter(async (context, next) =>
    {
        // Фильтр 1: Проверка на null и минимальную длину фамилии
        var celebrity = context.GetArgument<Celebrity>(0);
        if (celebrity == null)
            return Results.Problem("Ошибка: celebrity не может быть null", statusCode: 500);
        if (string.IsNullOrWhiteSpace(celebrity.Surname) || celebrity.Surname.Length < 2)
            return Results.Conflict("Ошибка: Surname не может быть пустым и должен содержать минимум 2 символа");
        return await next(context);
    })
    .AddEndpointFilter(async (context, next) =>
    {
        // Фильтр 2: Проверка уникальности фамилии
        var celebrity = context.GetArgument<Celebrity>(0);
        if (celebrity == null)
            return Results.Problem("Ошибка: celebrity не может быть null", statusCode: 500);
        if (repository.GetAllCelebrities().Any(c => c.Surname == celebrity.Surname))
            return Results.Conflict($"Ошибка: Celebrity с фамилией '{celebrity.Surname}' уже существует");
        return await next(context);
    })
    .AddEndpointFilter(async (context, next) =>
    {
        // Фильтр 3: Проверка существования файла с фото
        var celebrity = context.GetArgument<Celebrity>(0);
        if (celebrity == null)
            return Results.Problem("Ошибка: celebrity не может быть null", statusCode: 500);
        string basePath = "celebrities";  // Путь к файлам с фото
        string photoFileName = Path.GetFileName(celebrity.PhotoPath);
        string fullPhotoPath = Path.Combine(basePath, photoFileName);
        var response = await next(context);
        if (!File.Exists(fullPhotoPath))
        {
            context.HttpContext.Response.Headers["X-Celebrity"] = $"NotFound: {photoFileName}";
        }
        return response;
    });

    // Обработать DELETE-запросы
    app.MapDelete("/Celebrities/{id:int}", (int id) =>
    {
        bool deleted = repository.DelCelebrityById(id);
        if (!deleted)
            throw new FoundByIdException($"Celebrity Id = {id} not found");

        return Results.NoContent();
    });

    // Обработать PUT-запросы
    app.MapPut("/Celebrities/{id:int}", (int id, Celebrity celebrity) =>
    {
        int? updatedId = repository.UpdCelebrityById(id, celebrity);
        if (updatedId == null)
            throw new FoundByIdException($"Celebrity Id = {id} not found");

        if (repository.SaveChanges() <= 0)
            throw new SaveException("/Celebrities PUT error, SaveChanges() <= 0");

        return Results.Ok(new Celebrity(id, celebrity.Firstname, celebrity.Surname, celebrity.PhotoPath));
    });

    // Обработчик неизвестных маршрутов (Fallback)
    app.MapFallback((HttpContext ctx) =>
        Results.NotFound(new { error = $"path {ctx.Request.Path} not supported" }));

    // Обработчик ошибок (Error Handling)
    app.Map("/Celebrities/Error", (HttpContext ctx) =>
    {
        Exception? ex = ctx.Features.Get<IExceptionHandlerFeature>()?.Error;
        IResult rc = Results.Problem(
            title: "ASPA004",
            statusCode: 500,
            detail: ex?.Message + (ex?.StackTrace != null ? "\nStackTrace:\n" + ex.StackTrace : ""),
            instance: app.Environment.EnvironmentName
        );
        if (ex != null)
        {
            if (ex is FileNotFoundException)
                rc = Results.Problem(title: "ASPA004/FileNotFound", detail: ex.Message, instance: app.Environment.EnvironmentName, statusCode: 500);
            if (ex is FoundByIdException)
                rc = Results.NotFound(ex.Message);
            if (ex is BadHttpRequestException)
                rc = Results.BadRequest(ex.Message);
            if (ex is SaveException)
                rc = Results.Problem(title: "ASPA004/SaveChanges", detail: ex.Message, instance: app.Environment.EnvironmentName, statusCode: 500);
            if (ex is AddCelebrityException)
                rc = Results.Problem(title: "ASPA004/addCelebrity", detail: ex.Message, instance: app.Environment.EnvironmentName, statusCode: 500);
        }

        return rc;
    });

    // Запуск приложения
    app.Run();
}

// Классы исключений
public class FoundByIdException : Exception
{
    public FoundByIdException(string message) : base($"Found by Id: {message}") { }
}

public class SaveException : Exception
{
    public SaveException(string message) : base($"SaveChanges error: {message}") { }
}

public class AddCelebrityException : Exception
{
    public AddCelebrityException(string message) : base($"AddCelebrityException error: {message}") { }
}