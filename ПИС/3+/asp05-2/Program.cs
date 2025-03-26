using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using dal05;
using Validation;
using Microsoft.AspNetCore.Diagnostics;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

// ��������� ����� JSON, ������� ������������ ������������
Repository.JSONFileName = "Celebrities.json";

// �������� ���������� �����������
using (IRepository repository = new Repository("Celebrities"))
{
    // �������� ����������� � ����������� ���� ��������
    Validation.SurnameFilter.repository = repository;
    Validation.PhotoExistFilter.repository = repository;
    Validation.DeleteCelebrityFilter.repository = repository;

    // ����������� ���������
    RouteGroupBuilder api = app.MapGroup("/Celebrities");

    // ���������� ������
    app.UseExceptionHandler("/Celebrities/Error");

    // �������� ���� ������������� (GET /Celebrities)
    api.MapGet("", () => repository.GetAllCelebrities());

    // �������� ������������ �� ID (GET /Celebrities/{id})
    api.MapGet("/{id:int}", (int id) =>
    {
        Celebrity? celebrity = repository.GetCelebrityById(id);
        if (celebrity == null)
            throw new FoundByIdException($"Celebrity Id = {id}");
        return celebrity;
    });

    // �������� ����� ������������ (POST /Celebrities)
    api.MapPost("", (Celebrity celebrity) =>
    {
        int? id = repository.AddCelebrity(celebrity);
        if (id == null)
            throw new AddCelebrityException("POST /Celebrities error, id == null");

        if (repository.SaveChanges() <= 0)
            throw new SaveException("/Celebrities error, SaveChanges() <= 0");

        return new Celebrity((int)id, celebrity.Firstname, celebrity.Surname, celebrity.PhotoPath);
    })
    .AddEndpointFilter<Validation.SurnameFilter>()   // �������� ������� (�� ������ + ������������)
    .AddEndpointFilter<Validation.PhotoExistFilter>(); // �������� ������������� �����

    // �������� ������������ (PUT /Celebrities/{id})
    api.MapPut("/{id:int}", (int id, Celebrity celebrity) =>
    {
        int? updatedId = repository.UpdCelebrityById(id, celebrity);
        if (updatedId == null)
            throw new FoundByIdException($"Celebrity Id = {id} not found");

        if (repository.SaveChanges() <= 0)
            throw new SaveException("/Celebrities PUT error, SaveChanges() <= 0");

        return Results.Ok(new Celebrity(id, celebrity.Firstname, celebrity.Surname, celebrity.PhotoPath));
    })
    .AddEndpointFilter<Validation.UpdateCelebrityFilter>(); // �������� ���������� ������

    // ������� ������������ (DELETE /Celebrities/{id})
    api.MapDelete("/{id:int}", (int id) =>
    {
        bool deleted = repository.DelCelebrityById(id);
        if (!deleted)
            throw new FoundByIdException($"Celebrity Id = {id} not found");

        return Results.Ok($"Celebrity/{id} was deleted");
    })
    .AddEndpointFilter<Validation.DeleteCelebrityFilter>(); // �������� ����� ���������

    // ���������� ����������� ��������� (Fallback)
    app.MapFallback((HttpContext ctx) =>
        Results.NotFound(new { error = $"path {ctx.Request.Path} not supported" }));

    // ���������� ������ (Error Handling)
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

namespace Validation
{
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

    public class SurnameFilter : IEndpointFilter
    {
        public static IRepository repository { get; set; } = null!;
        public async ValueTask<object?> InvokeAsync(EndpointFilterInvocationContext context, EndpointFilterDelegate next)
        {
            var celebrity = context.GetArgument<Celebrity>(0);
            if (celebrity == null)
                return Results.Problem("������: celebrity �� ����� ���� null", statusCode: 500);
            if (string.IsNullOrWhiteSpace(celebrity.Surname) || celebrity.Surname.Length < 2)
                return Results.Conflict("������: Surname �� ����� ���� ������ � ������ ��������� ������� 2 �������");
            if (repository.GetAllCelebrities().Any(c => c.Surname == celebrity.Surname))
                return Results.Conflict($"������: Celebrity � �������� '{celebrity.Surname}' ��� ����������");
            return await next(context);
        }
    }

    public class PhotoExistFilter : IEndpointFilter
    {
        public static IRepository repository { get; set; } = null!;
        public async ValueTask<object?> InvokeAsync(EndpointFilterInvocationContext context, EndpointFilterDelegate next)
        {
            var celebrity = context.GetArgument<Celebrity>(0);
            if (celebrity == null)
                return Results.Problem("������: celebrity �� ����� ���� null", statusCode: 500);
            string basePath = "celebrities";  // ���� � ������ � ����
            string photoFileName = Path.GetFileName(celebrity.PhotoPath);
            string fullPhotoPath = Path.Combine(basePath, photoFileName);
            var response = await next(context);
            if (!File.Exists(fullPhotoPath))
            {
                context.HttpContext.Response.Headers["X-Celebrity"] = $"NotFound: {photoFileName}";
            }
            return response;
        }
    }

    public class UpdateCelebrityFilter : IEndpointFilter
    {
        public async ValueTask<object?> InvokeAsync(EndpointFilterInvocationContext context, EndpointFilterDelegate next)
        {
            var celebrity = context.GetArgument<Celebrity>(1);
            if (celebrity == null)
                return Results.Problem("������: celebrity �� ����� ���� null", statusCode: 500);
            return await next(context);
        }
    }

    public class DeleteCelebrityFilter : IEndpointFilter
    {
        public static IRepository repository { get; set; } = null!;
        public async ValueTask<object?> InvokeAsync(EndpointFilterInvocationContext context, EndpointFilterDelegate next)
        {
            int id = context.GetArgument<int>(0);
            if (repository.GetCelebrityById(id) == null)
                return Results.NotFound($"Celebrity Id = {id} not found");
            return await next(context);
        }
    }
}