using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

internal class Program // Определение внутреннего класса Program
{
    private static void Main(string[] args) // Основной метод, точка входа в приложение
    {
        // Создание объекта builder для настройки приложения
        var builder = WebApplication.CreateBuilder(args);
        // Добавляем поддержку HTTP Logging
        builder.Services.AddHttpLogging(options =>
        {
            options.LoggingFields = Microsoft.AspNetCore.HttpLogging.HttpLoggingFields.All; // Логируем все поля
        });
        // Добавление сервисов для поддержки Razor Pages в контейнер зависимостей
        builder.Services.AddRazorPages();
        // Построение веб-приложения на основе настроек, указанных в builder
        var app = builder.Build();
        // Включаем HTTP Logging middleware
        app.UseHttpLogging();
        // Настройка маршрута: при получении GET-запроса на корневой адрес ("/") возвращается строка
        app.MapGet("/", () => "Мое первое ASP-приложение!");
        // Запуск приложения и ожидание входящих HTTP-запросов
        app.Run(); 
    }
}