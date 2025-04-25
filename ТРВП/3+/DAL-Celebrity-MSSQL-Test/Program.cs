using DAL_Celebrity;
using DAL_Celebrity_MSSQL;
using System;
using System.Collections.Generic;

class Program
{
    private static Func<Celebrity, string> printC = (c) => $"Id = {c.Id}, FullName = {c.FullName}, Nationality = {c.Nationality}, ReqPhotoPath = {c.ReqPhotoPath}";
    private static Func<Lifeevent, string> printL = (l) => $"Id = {l.Id}, CelebrityId = {l.CelebrityId}, Date = {l.Date.ToShortDateString()}, Description = {l.Description}, ReqPhotoPath = {l.ReqPhotoPath}";

    private static void Main(string[] args)
    {
        string CS = "Data Source=DESKTOP-3SMK9QM;Initial Catalog=LEC;Integrated Security=True;TrustServerCertificate=True";

        Init init = new(CS);
        try
        {
            Init.Execute(delete: true, create: true);
            Console.WriteLine("Инициализация данных завершилась успешно.");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Возникла ошибка во время инициализации: {ex.Message}");
            return;
        }

        using (IRepository<Celebrity, Lifeevent> repo = Repository.Create(CS))
        {
            if (repo == null)
            {
                Console.WriteLine("Репозиторий не был создан.");
                return;
            }

            Console.WriteLine("------ GetAllCelebrities() ------------- ");
            try
            {
                repo.GetAllCelebrities().ForEach(celebrity => Console.WriteLine(printC(celebrity)));
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred while fetching celebrities: {ex.Message}");
            }
            Console.WriteLine("");

            Console.WriteLine("------ GetAllLifeevents() ------------- ");
            try
            {
                repo.GetAllLifeevents().ForEach(life => Console.WriteLine(printL(life)));
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred while fetching life events: {ex.Message}");
            }
            Console.WriteLine("");

            Console.WriteLine("------ AddCelebrity() ------------- ");
            AddCelebrity(repo, "Albert Einstein", "DE", "Einstein.jpg");
            AddCelebrity(repo, "Samuel Huntington", "US", "Huntington.jpg");
            Console.WriteLine("");

            Console.WriteLine("------ DeleteCelebrity() ------------- ");
            DeleteCelebrity(repo, "Einstein");
            Console.WriteLine("");

            Console.WriteLine("------ UpdateCelebrity() ------------- ");
            UpdateCelebrity(repo, "Huntington", "Samuel Phillips Huntington");
            Console.WriteLine("");

            Console.WriteLine("------ TestLifeeventOperations() ------------- ");
            int celebrityId = repo.GetCelebrityIdByName("Huntington");
            List<int> eventIds = AddLifeevents(repo, celebrityId);
            if (eventIds.Count >= 2)
                TestLifeeventOperations(repo, eventIds[1], eventIds[0]);
            Console.WriteLine("");

            Console.WriteLine("------ GetLifeeventsByCelebrityId() ------------- ");
            GetLifeeventsByCelebrityId(repo, "Huntington");
            Console.WriteLine("");

            Console.WriteLine("------ GetCelebrityByLifeeventId() ------------- ");
            GetCelebrityByLifeeventId(repo, eventIds.Count >= 2 ? eventIds[0] : -1);
            Console.WriteLine("");
        }

        Console.WriteLine("------------>");
        Console.ReadKey();
    }

    private static void AddCelebrity(IRepository<Celebrity, Lifeevent> repo, string fullName, string nationality, string photoPath)
    {
        Celebrity c = new Celebrity
        {
            FullName = fullName,
            Nationality = nationality,
            ReqPhotoPath = $"D:\\BSTU\\6 sem\\ТРВП\\Лабы\\3\\asp06\\wwwroot\\photos\\{photoPath}"
        };
        try
        {
            if (repo.AddCelebrity(c))
                Console.WriteLine($"OK: AddCelebrity: {printC(c)}");
            else
                Console.WriteLine($"ERROR: AddCelebrity: {printC(c)}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"An error occurred while adding celebrity: {ex.Message}");
        }
    }

    private static void DeleteCelebrity(IRepository<Celebrity, Lifeevent> repo, string name)
    {
        int id = repo.GetCelebrityIdByName(name);
        if (id > 0)
        {
            Celebrity? c = repo.GetCelebrityById(id);
            if (c != null)
            {
                try
                {
                    if (repo.DelCelebrity(id))
                        Console.WriteLine($"OK: DelCelebrity: {id}");
                    else
                        Console.WriteLine($"ERROR: DelCelebrity: {id}");
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"An error occurred while deleting celebrity: {ex.Message}");
                }
            }
        }
    }

    private static void UpdateCelebrity(IRepository<Celebrity, Lifeevent> repo, string oldName, string newName)
    {
        int id = repo.GetCelebrityIdByName(oldName);
        if (id > 0)
        {
            Celebrity? c = repo.GetCelebrityById(id);
            if (c != null)
            {
                c.FullName = newName;
                try
                {
                    if (repo.UpdCelebrity(id, c))
                        Console.WriteLine($"OK: UpdCelebrity: {id}, {printC(c)}");
                    else
                        Console.WriteLine($"ERROR: UpdCelebrity: {id}");
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"An error occurred while updating celebrity: {ex.Message}");
                }
            }
        }
    }

    private static List<int> AddLifeevents(IRepository<Celebrity, Lifeevent> repo, int celebrityId)
    {
        List<int> ids = new();

        if (celebrityId > 0)
        {
            try
            {
                Lifeevent l1 = new Lifeevent { CelebrityId = celebrityId, Date = new DateTime(1927, 4, 18), Description = "Дата рождения" };
                if (repo.AddLifeevent(l1))
                {
                    ids.Add(l1.Id);
                    Console.WriteLine($"OK: AddLifeevent, {printL(l1)}");
                }

                Lifeevent l2 = new Lifeevent { CelebrityId = celebrityId, Date = new DateTime(2008, 12, 24), Description = "Дата смерти" };
                if (repo.AddLifeevent(l2))
                {
                    ids.Add(l2.Id);
                    Console.WriteLine($"OK: AddLifeevent, {printL(l2)}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred while adding life events: {ex.Message}");
            }
        }

        return ids;
    }

    private static void TestLifeeventOperations(IRepository<Celebrity, Lifeevent> repo, int deleteId, int updateId)
    {
        try
        {
            if (repo.DelLifeevent(deleteId))
                Console.WriteLine($"OK: DelLifeevent: {deleteId}");
            else
                Console.WriteLine($"ERROR: DelLifeevent: {deleteId}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"An error occurred while deleting life event: {ex.Message}");
        }

        try
        {
            Lifeevent? lifeeventToUpdate = repo.GetLifeevetById(updateId);
            if (lifeeventToUpdate != null)
            {
                lifeeventToUpdate.Description = $"Обновлено: {lifeeventToUpdate.Description}";
                if (repo.UpdLifeevent(updateId, lifeeventToUpdate))
                    Console.WriteLine($"OK: UpdLifeevent {updateId}, {printL(lifeeventToUpdate)}");
                else
                    Console.WriteLine($"ERROR: UpdLifeevent {updateId}, {printL(lifeeventToUpdate)}");
            }
            else
            {
                Console.WriteLine($"ERROR: Lifeevent not found: {updateId}");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"An error occurred while updating life event: {ex.Message}");
        }
    }

    private static void GetLifeeventsByCelebrityId(IRepository<Celebrity, Lifeevent> repo, string celebrityName)
    {
        int id = repo.GetCelebrityIdByName(celebrityName);
        if (id > 0)
        {
            Celebrity? c = repo.GetCelebrityById(id);
            if (c != null)
            {
                try
                {
                    var lifeevents = repo.GetLifeeventsByCelebrityId(c.Id);
                    lifeevents.ForEach(l => Console.WriteLine(printL(l)));
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"An error occurred while fetching life events for {c.FullName}: {ex.Message}");
                }
            }
        }
    }

    private static void GetCelebrityByLifeeventId(IRepository<Celebrity, Lifeevent> repo, int lifeeventId)
    {
        try
        {
            if (lifeeventId <= 0)
            {
                Console.WriteLine("ERROR: Invalid lifeeventId for lookup.");
                return;
            }

            Celebrity? c = repo.GetCelebrityByLifeeventId(lifeeventId);
            if (c != null)
                Console.WriteLine($"OK: GetCelebrityByLifeeventId: {printC(c)}");
            else
                Console.WriteLine($"ERROR: GetCelebrityByLifeeventId, {lifeeventId}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"An error occurred while fetching celebrity by life event ID: {ex.Message}");
        }
    }
}