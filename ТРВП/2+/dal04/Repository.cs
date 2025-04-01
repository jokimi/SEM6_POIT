using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;

namespace dal04
{
    public class Repository : IRepository
    {
        private readonly string _directoryPath;
        private readonly string _jsonFilePath;
        private List<Celebrity> _celebrities;
        public static string JSONFileName { get; set; } = "Celebrities.json";
        public string BasePath => Path.Combine(Directory.GetCurrentDirectory(), _directoryPath);

        public Repository(string directoryPath, string jsonFileName = "Celebrities.json")
        {
            _directoryPath = directoryPath;
            _jsonFilePath = Path.Combine(BasePath, jsonFileName);
            Console.WriteLine($"Файл JSON ожидается по пути: {_jsonFilePath}");
            LoadCelebrities();
        }

        private void LoadCelebrities()
        {
            if (!File.Exists(_jsonFilePath))
            {
                return;
            }
            var jsonData = File.ReadAllText(_jsonFilePath);
            _celebrities = JsonSerializer.Deserialize<List<Celebrity>>(jsonData) ?? new List<Celebrity>();
        }

        public Celebrity[] GetAllCelebrities() => _celebrities.ToArray();
        public Celebrity? GetCelebrityById(int id) => _celebrities.FirstOrDefault(c => c.Id == id);
        public Celebrity[] GetCelebritiesBySurname(string surname) =>
            _celebrities.Where(c => string.Equals(c.Surname, surname, StringComparison.OrdinalIgnoreCase)).ToArray();
        public string? GetPhotoPathById(int id) => GetCelebrityById(id)?.PhotoPath;

        public int? AddCelebrity(Celebrity celebrity)
        {
            int newId = _celebrities.Count > 0 ? _celebrities.Max(c => c.Id) + 1 : 1;
            var newCelebrity = new Celebrity(newId, celebrity.Firstname, celebrity.Surname, celebrity.PhotoPath);
            _celebrities.Add(newCelebrity);
            return newId;
        }

        public bool DelCelebrityById(int id)
        {
            var celebrity = _celebrities.FirstOrDefault(c => c.Id == id);
            if (celebrity == null) return false;
            _celebrities.Remove(celebrity);
            return true;
        }

        public int? UpdCelebrityById(int id, Celebrity celebrity)
        {
            var existingCelebrity = _celebrities.FirstOrDefault(c => c.Id == id);
            if (existingCelebrity == null) return null;

            var updatedCelebrity = new Celebrity(id, celebrity.Firstname, celebrity.Surname, celebrity.PhotoPath);
            _celebrities[_celebrities.IndexOf(existingCelebrity)] = updatedCelebrity;
            return id;
        }

        public int SaveChanges()
        {
            File.WriteAllText(_jsonFilePath, JsonSerializer.Serialize(_celebrities, new JsonSerializerOptions { WriteIndented = true }));
            return _celebrities.Count;
        }

        public void Dispose()
        {
            SaveChanges();
        }
    }
}