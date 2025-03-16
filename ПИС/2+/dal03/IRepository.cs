using System;

namespace dal03
{
    public interface IRepository : IDisposable
    {
        string BasePath { get; }
        Celebrity[] GetAllCelebrities();
        Celebrity GetCelebrityById(int id);
        Celebrity[] GetCelebritiesBySurname(string surname);
        string GetPhotoPathById(int id);
    }
}