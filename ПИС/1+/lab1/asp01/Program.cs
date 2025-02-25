using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

internal class Program // ����������� ����������� ������ Program
{
    private static void Main(string[] args) // �������� �����, ����� ����� � ����������
    {
        // �������� ������� builder ��� ��������� ����������
        var builder = WebApplication.CreateBuilder(args);
        // ��������� ��������� HTTP Logging
        builder.Services.AddHttpLogging(options =>
        {
            options.LoggingFields = Microsoft.AspNetCore.HttpLogging.HttpLoggingFields.All; // �������� ��� ����
        });
        // ���������� �������� ��� ��������� Razor Pages � ��������� ������������
        builder.Services.AddRazorPages();
        // ���������� ���-���������� �� ������ ��������, ��������� � builder
        var app = builder.Build();
        // �������� HTTP Logging middleware
        app.UseHttpLogging();
        // ��������� ��������: ��� ��������� GET-������� �� �������� ����� ("/") ������������ ������
        app.MapGet("/", () => "��� ������ ASP-����������!");
        // ������ ���������� � �������� �������� HTTP-��������
        app.Run(); 
    }
}