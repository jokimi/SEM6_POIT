using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

internal class Program
{
    private static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        var app = builder.Build();

        // Группа маршрутов A (целые числа)
        app.MapGet("/A/{x:int:max(100)}", (HttpContext context, [FromRoute] int x) =>
            Results.Ok(new { path = context.Request.Path.Value, x = x }));
        app.MapPost("/A/{x:int:range(0,100)}", (HttpContext context, [FromRoute] int x) =>
            Results.Ok(new { path = context.Request.Path.Value, x = x }));
        app.MapPut("/A/{x:int:min(1)}/{y:int:min(1)}", (HttpContext context, [FromRoute] int x, [FromRoute] int y) =>
            Results.Ok(new { path = context.Request.Path.Value, x = x, y = y }));
        app.MapDelete("/A/{x:int:min(1)}-{y:int:range(1,100)}", (HttpContext context, [FromRoute] int x, [FromRoute] int y) =>
            Results.Ok(new { path = context.Request.Path.Value, x = x, y = y }));

        // Группа маршрутов B (числа с плавающей запятой)
        app.MapGet("/B/{x:float}", (HttpContext context, [FromRoute] float x) =>
            Results.Ok(new { path = context.Request.Path.Value, x = x }));
        app.MapPost("/B/{x:float}/{y:float}", (HttpContext context, [FromRoute] float x, [FromRoute] float y) =>
            Results.Ok(new { path = context.Request.Path.Value, x = x, y = y }));
        app.MapDelete("/B/{x:float}-{y:float}", (HttpContext context, [FromRoute] float x, [FromRoute] float y) =>
            Results.Ok(new { path = context.Request.Path.Value, x = x, y = y }));

        // Группа маршрутов C (булевы значения)
        app.MapGet("/C/{x:bool}", (HttpContext context, [FromRoute] bool x) =>
            Results.Ok(new { path = context.Request.Path.Value, x = x }));
        app.MapPost("/C/{x:bool},{y:bool}", (HttpContext context, [FromRoute] bool x, [FromRoute] bool y) =>
            Results.Ok(new { path = context.Request.Path.Value, x = x, y = y }));

        // Группа маршрутов D (даты)
        app.MapGet("/D/{x:datetime}", (HttpContext context, [FromRoute] DateTime x) =>
            Results.Ok(new { path = context.Request.Path.Value, x = x }));
        app.MapPost("/D/{x:datetime}|{y:datetime}", (HttpContext context, [FromRoute] DateTime x, [FromRoute] DateTime y) =>
            Results.Ok(new { path = context.Request.Path.Value, x = x, y = y }));

        // Группа маршрутов E (строковые ограничения)
        app.MapGet("/E/12-{x:required}", (HttpContext context, [FromRoute] string x) =>
            Results.Ok(new { path = context.Request.Path.Value, x = x }));
        app.MapPut("/E/{x:alpha:length(2,12)}", (HttpContext context, [FromRoute] string x) =>
            Results.Ok(new { path = context.Request.Path.Value, x = x }));

        // Группа маршрутов F (email с доменом ".by")
        app.MapPut("/F/{x:regex(^[\\w.-]+@[\\w.-]+\\.by$)}", (string x) => Results.Ok(new { path = $"/F/{x}", x }));

        // Обработчик ошибок
        app.UseExceptionHandler("/Error");
        app.Use(async (context, next) =>
        {
            await next();

            if (context.Response.StatusCode == 404)
            {
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsync("{ \"error\": \"Route constraint validation failed.\" }");
            }
        });
        app.Map("/Error", (HttpContext ctx) =>
        {
            Exception? ex = ctx.Features.Get<IExceptionHandlerFeature>()?.Error;
            return Results.Problem(ex?.Message);
        });

        app.Run();
    }
}