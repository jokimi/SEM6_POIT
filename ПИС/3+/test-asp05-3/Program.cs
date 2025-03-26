using System;
using System.IO;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading.Tasks;

class Program
{
    static async Task Main()
    {
        var test = new Test();

        Console.WriteLine("--- /A -----------------------------------------------------------------");

        await test.ExecuteGET<int?>("http://localhost:5298/A/3", (int? x, int? y, int status) =>
            (x == 3 && y == null && status == 200) ? Test.OK : Test.NOK);

        await test.ExecuteGET<int?>("http://localhost:5298/A/-3", (int? x, int? y, int status) =>
            (x == -3 && y == null && status == 200) ? Test.OK : Test.NOK);

        await test.ExecuteGET<int?>("http://localhost:5298/A/118", (int? x, int? y, int status) =>
            (x == null && y == null && status == 404) ? Test.OK : Test.NOK);

        await test.ExecutePOST<int?>("http://localhost:5298/A/5", (int? x, int? y, int status) =>
            (x == 5 && y == null && status == 200) ? Test.OK : Test.NOK);

        await test.ExecutePUT<int?>("http://localhost:5298/A/2/3", (int? x, int? y, int status) =>
            (x == 2 && y == 3 && status == 200) ? Test.OK : Test.NOK);

        await test.ExecuteDELETE<int?>("http://localhost:5298/A/1-99", (int? x, int? y, int status) =>
            (x == 1 && y == 99 && status == 200) ? Test.OK : Test.NOK);

        Console.WriteLine("- /B");

        await test.ExecuteGET<float?>("http://localhost:5298/B/2.5", (float? x, float? y, int status) =>
            (x == 2.5f && y == null && status == 200) ? Test.OK : Test.NOK);

        await test.ExecutePOST<float?>("http://localhost:5298/B/2.5/3.2", (float? x, float? y, int status) =>
            (x == 2.5f && y == 3.2f && status == 200) ? Test.OK : Test.NOK);

        await test.ExecuteDELETE<float?>("http://localhost:5298/B/2.5-3.2", (float? x, float? y, int status) =>
            (x == 2.5f && y == 3.2f && status == 200) ? Test.OK : Test.NOK);

        Console.WriteLine("- /C");

        await test.ExecuteGET<bool?>("http://localhost:5298/C/true", (bool? x, bool? y, int status) =>
            (x == true && y == null && status == 200) ? Test.OK : Test.NOK);

        await test.ExecutePOST<bool?>("http://localhost:5298/C/true,false", (bool? x, bool? y, int status) =>
            (x == true && y == false && status == 200) ? Test.OK : Test.NOK);

        Console.WriteLine("- /D");

        await test.ExecuteGET<DateTime?>("http://localhost:5298/D/2025-02-25", (DateTime? x, DateTime? y, int status) =>
            (x == new DateTime(2025, 02, 25) && y == null && status == 200) ? Test.OK : Test.NOK);

        Console.WriteLine("- /E");

        await test.ExecuteGET<string?>("http://localhost:5298/E/12-bis", (string? x, string? y, int status) =>
            (x == "bis" && y == null && status == 200) ? Test.OK : Test.NOK);

        await test.ExecutePUT<string?>("http://localhost:5298/E/abcd", (string? x, string? y, int status) =>
            (x == "abcd" && y == null && status == 200) ? Test.OK : Test.NOK);

        Console.WriteLine("Тестирование завершено.");
    }
}

class Test
{
    class Answer<T>
    {
        public T? x { get; set; } = default(T?);
        public T? y { get; set; } = default(T?);
        public string? message { get; set; } = null;
    }
    public static string OK = "ОK", NOK = "NOK";
    HttpClient client = new HttpClient();
    public async Task ExecuteGET<T>(string path, Func<T?, T?, int, string> result)
    {
        await resultPRINT<T>("GET", path, await this.client.GetAsync(path), result);
    }
    public async Task ExecutePOST<T>(string path, Func<T?, T?, int, string> result)
    {
        await resultPRINT<T>("POST", path, await this.client.PostAsync(path, null), result);
    }
    public async Task ExecutePUT<T>(string path, Func<T?, T?, int, string> result)
    {
        await resultPRINT<T>("PUT", path, await this.client.PutAsync(path, null), result);
    }
    public async Task ExecuteDELETE<T>(string path, Func<T?, T?, int, string> result)
    {
        await resultPRINT<T>("DELETE", path, await this.client.DeleteAsync(path), result);
    }
    async Task resultPRINT<T>(string method, string path, HttpResponseMessage rm, Func<T?, T?, int, string> result)
    {
        int status = (int)rm.StatusCode;
        try
        {
            Answer<T>? answer = await rm.Content.ReadFromJsonAsync<Answer<T>>() ?? default(Answer<T>);
            string r = result(default(T), default(T), status);
            T? x = default(T), y = default(T);
            if (answer != null)
                r = result(x = answer.x, y = answer.y, status);
            Console.WriteLine($" {r}: {method} {path}, status = {status}, x = {x}, y = {y}, m = {answer?.message}");
        }
        catch (JsonException ex)
        {
            string r = result(default(T), default(T), status);
            Console.WriteLine($" {r}: {method} {path}, status = {status}, x = {null}, y = {null}, m = {ex.Message}");
        }
    }
}