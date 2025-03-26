using System;

namespace dal05
{
    public interface IRepository : IDisposable
    {
        string BasePath { get; }                                // полный директорий для JSON и фотографий
        Celebrity[] GetAllCelebrities();                        // получить весь список знаменитостей
        Celebrity? GetCelebrityById(int id);                    // получить знаменитость по id
        Celebrity[] GetCelebritiesBySurname(string surname);    // получить знаменитость по фамилии
        string? GetPhotoPathById(int id);                       // получить путь для GET-запроса к фотографии
        int? AddCelebrity(Celebrity celebrity);                 // добавить знаменитость, = id новой знаменитости
        bool DelCelebrityById(int id);                          // удалить знаменитость по id; = true - успеx
        int? UpdCelebrityById(int id, Celebrity celebrity);     // изменить знаменитость по id; = id - новый id - успех
        int SaveChanges();                                      // сохранить изменения в JSON, = количество изменений
    }
}