using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using dal04;
using Microsoft.AspNetCore.Diagnostics;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();
Repository.JSONFileName = "Celebrities.json";

using (IRepository repository = new Repository("Celebrities"))
{
    app.UseExceptionHandler("/Celebrities/Error");

    app.MapGet("/Celebrities", () => repository.GetAllCelebrities());

    app.MapGet("/Celebrities/{id:int}", (int id) =>
    {
        Celebrity? celebrity = repository.GetCelebrityById(id);
        if (celebrity == null)
            throw new FoundByIdException($"Celebrity Id = {id}");
        return celebrity;
    });

    app.MapPost("/Celebrities", (Celebrity celebrity) =>
    {
        int? id = repository.AddCelebrity(celebrity);
        if (id == null)
            throw new AddCelebrityException("/Celebrities error, id == null");

        if (repository.SaveChanges() <= 0)
            throw new SaveException("/Celebrities error, SaveChanges() <= 0");

        return new Celebrity((int)id, celebrity.Firstname, celebrity.Surname, celebrity.PhotoPath);
    });

    app.MapDelete("/Celebrities/{id:int}", (int id) =>
    {
        bool deleted = repository.DelCelebrityById(id);
        if (!deleted)
            throw new FoundByIdException($"Celebrity Id = {id} not found");

        return Results.NoContent();
    });

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

    app.Run();
}

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