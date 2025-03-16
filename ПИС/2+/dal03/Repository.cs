using dal03;
using System;
using System.IO;
using System.Linq;
using System.Text.Json;

public class Repository : IRepository
{
    private static string _jsonFileName;
    private readonly string _directoryPath;
    private Celebrity[] _celebrities;

    public static string JSONFileName
    {
        get => _jsonFileName;
        set => _jsonFileName = value;
    }

    public string BasePath => Path.Combine(Directory.GetCurrentDirectory(), _directoryPath);

    public Repository(string directoryPath)
    {
        _directoryPath = directoryPath;
        LoadCelebrities();
    }

    private void LoadCelebrities()
    {
        var jsonFilePath = Path.Combine(BasePath, JSONFileName);
        if (!File.Exists(jsonFilePath))
        {
            throw new FileNotFoundException($"File not found: {jsonFilePath}");
        }
        var jsonData = File.ReadAllText(jsonFilePath);
        _celebrities = JsonSerializer.Deserialize<Celebrity[]>(jsonData);
    }

    public Celebrity[] GetAllCelebrities() => _celebrities;

    public Celebrity GetCelebrityById(int id) => _celebrities.FirstOrDefault(c => c.Id == id);

    public Celebrity[] GetCelebritiesBySurname(string surname) =>
        _celebrities.Where(c => string.Equals(c.Surname, surname, StringComparison.OrdinalIgnoreCase)).ToArray();

    public string GetPhotoPathById(int id) => GetCelebrityById(id)?.PhotoPath;

    public void Dispose() { }
}