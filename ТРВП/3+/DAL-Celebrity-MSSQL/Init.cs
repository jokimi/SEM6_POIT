using DAL_Celebrity;
using Microsoft.EntityFrameworkCore;
using System;

namespace DAL_Celebrity_MSSQL
{
    public class Init
    {
        static string connstring = "Data Source=DESKTOP-3SMK9QM;Initial Catalog=LEC;Integrated Security=True;TrustServerCertificate=True";

        public Init() { }

        public Init(string conn)
        {
            connstring = conn;
        }

        public static void Execute(bool delete = true, bool create = true)
        {
            Console.WriteLine("Инициализация БД...");
            if (string.IsNullOrEmpty(connstring))
            {
                throw new ArgumentException("Connection string must not be null or empty.");
            }

            using (Context context = new(connstring))
            {
                if (delete)
                    context.Database.EnsureDeleted();
                if (create)
                    context.Database.EnsureCreated();
                Func<string, string> puri = (string f) => $"D:\\BSTU\\6 sem\\ТРВП\\Лабы\\3\\asp06\\wwwroot\\photos\\{f}";
                InitializeData(context, puri);
                context.SaveChanges();
            }
        }

        private static void InitializeData(Context context, Func<string, string> puri)
        {
            AddCelebrityWithLifeevents(context, "Noam Chomsky", "US", "Chomsky.jpg",
                new DateTime(1928, 12, 7), "Дата рождения",
                new DateTime(1955, 1, 1), "Издание книги \"Логическая структура лингвистической теории\"", puri);
            AddCelebrityWithLifeevents(context, "Tim Berners-Lee", "UK", "Berners-Lee.jpg",
                new DateTime(1955, 6, 8), "Дата рождения",
                new DateTime(1989, 6, 8), "В CERN предложил \"Гиппертекстовый проект\"", puri);
            AddCelebrityWithLifeevents(context, "Edgar Codd", "US", "Codd.jpg",
                new DateTime(1923, 8, 23), "Дата рождения",
                new DateTime(2003, 4, 18), "Дата смерти", puri);
            AddCelebrityWithLifeevents(context, "Donald Knuth", "US", "Knuth.jpg",
                new DateTime(1938, 1, 10), "Дата рождения",
                new DateTime(1974, 1, 1), "Премия Тьюринга", puri);
            AddCelebrityWithLifeevents(context, "Linus Torvalds", "US", "Linus.jpg",
                new DateTime(1969, 12, 28), "Дата рождения. Финляндия.",
                new DateTime(1991, 9, 17), "Выложил исходный код  OS Linus (версии 0.01)", puri);
            AddCelebrityWithLifeevents(context, "John Neumann", "US", "Neumann.jpg",
                new DateTime(1903, 12, 28), "Дата рождения. Венгрия.",
                new DateTime(1957, 2, 8), "Дата смерти", puri);
            AddCelebrityWithLifeevents(context, "Edsger Dijkstra", "NL", "Dijkstra.jpg",
                new DateTime(1930, 12, 28), "Дата рождения",
                new DateTime(2002, 8, 6), "Дата смерти", puri);
            AddCelebrityWithLifeevents(context, "Ada Lovelace", "UK", "Lovelace.jpg",
                new DateTime(1852, 11, 27), "Дата рождения",
                new DateTime(1915, 12, 10), "Дата смерти", puri);
            AddCelebrityWithLifeevents(context, "Charles Babbage", "UK", "Babbage.jpg",
                new DateTime(1791, 12, 26), "Дата рождения",
                new DateTime(1871, 10, 18), "Дата смерти", puri);
            AddCelebrityWithLifeevents(context, "Andrew Tanenbaum", "NL", "Tanenbaum.jpg",
                new DateTime(1944, 3, 16), "Дата рождения",
                new DateTime(1987, 1, 1), "Cоздал OS MINIX — бесплатную Unix-подобную систему", puri);
        }

        public static void AddCelebrityWithLifeevents(Context context, string fullName, string nationality, string photoFileName,
            DateTime eventDate1, string eventDescription1, DateTime eventDate2, string eventDescription2, Func<string, string> puri)
        {
            if (context == null)
                throw new ArgumentNullException(nameof(context));
            if (string.IsNullOrEmpty(fullName))
                throw new ArgumentException("Full name cannot be null or empty", nameof(fullName));
            if (string.IsNullOrEmpty(nationality))
                throw new ArgumentException("Nationality cannot be null or empty", nameof(nationality));
            if (string.IsNullOrEmpty(photoFileName))
                throw new ArgumentException("Photo filename cannot be null or empty", nameof(photoFileName));
            if (string.IsNullOrEmpty(eventDescription1))
                throw new ArgumentException("Event description 1 cannot be null or empty", nameof(eventDescription1));
            if (string.IsNullOrEmpty(eventDescription2))
                throw new ArgumentException("Event description 2 cannot be null or empty", nameof(eventDescription2));

            string resolvedPhotoPath = puri(photoFileName);
            Console.WriteLine($"fullName: {fullName}, nationality: {nationality}, photo: {photoFileName}, resolvedPhotoPath: {resolvedPhotoPath}");

            var celebrity = new Celebrity
            {
                FullName = fullName,
                Nationality = nationality,
                ReqPhotoPath = resolvedPhotoPath
            };

            context.Celebrities.Add(celebrity);
            Console.WriteLine($"Adding celebrity: {celebrity.FullName}");

            try
            {
                context.SaveChanges();
                Console.WriteLine($"Celebrity saved with Id: {celebrity.Id}");
            }
            catch (Exception ex)
            {
                Console.WriteLine("Exception occurred while saving celebrity:");
                Console.WriteLine(ex.ToString());
                throw;
            }

            if (celebrity.Id == 0)
            {
                throw new InvalidOperationException("Failed to save the celebrity and generate an Id.");
            }

            var lifeEvent1 = new Lifeevent { CelebrityId = celebrity.Id, Date = eventDate1, Description = eventDescription1 };
            var lifeEvent2 = new Lifeevent { CelebrityId = celebrity.Id, Date = eventDate2, Description = eventDescription2 };

            context.Lifeevents.Add(lifeEvent1);
            context.Lifeevents.Add(lifeEvent2);

            try
            {
                context.SaveChanges();
                Console.WriteLine($"Life events added for celebrity Id: {celebrity.Id}");
            }
            catch (Exception ex)
            {
                Console.WriteLine("Exception occurred while saving life events:");
                Console.WriteLine(ex.ToString());
                throw;
            }
        }
    }
}