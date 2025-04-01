using System;
using dal04;

class Program
{
    static void Main()
    {
        Repository repository = new Repository("Celebrities");

        void Print(string label)
        {
            Console.WriteLine("\n--- " + label + " ---");
            foreach (var c in repository.GetAllCelebrities())
            {
                Console.WriteLine($"Id = {c.Id}, Firstname = {c.Firstname}, Surname = {c.Surname}, PhotoPath = {c.PhotoPath}");
            }
        }

        Print("Start");

        int? testDel1 = repository.AddCelebrity(new Celebrity(0, "TestDel1", "TestDel1", "Photo/TestDel1.jpg"));
        int? testDel2 = repository.AddCelebrity(new Celebrity(0, "TestDel2", "TestDel2", "Photo/TestDel2.jpg"));
        int? testUpd1 = repository.AddCelebrity(new Celebrity(0, "TestUpd1", "TestUpd1", "Photo/TestUpd1.jpg"));
        int? testUpd2 = repository.AddCelebrity(new Celebrity(0, "TestUpd2", "TestUpd2", "Photo/TestUpd2.jpg"));

        repository.SaveChanges();
        Print("Added 4");

        if (testDel1 != null && repository.DelCelebrityById((int)testDel1))
            Console.WriteLine($"Deleted {testDel1}");
        else
            Console.WriteLine($"Delete {testDel1} error");

        if (testDel2 != null && repository.DelCelebrityById((int)testDel2))
            Console.WriteLine($"Deleted {testDel2}");
        else
            Console.WriteLine($"Delete {testDel2} error");

        repository.SaveChanges();
        Print("Deleted 2");

        if (testUpd1 != null && repository.UpdCelebrityById((int)testUpd1, new Celebrity(0, "Updated1", "Updated1", "Photo/Updated1.jpg")) != null)
            Console.WriteLine($"Updated {testUpd1}");
        else
            Console.WriteLine($"Update {testUpd1} error");

        if (testUpd2 != null && repository.UpdCelebrityById((int)testUpd2, new Celebrity(0, "Updated2", "Updated2", "Photo/Updated2.jpg")) != null)
            Console.WriteLine($"Updated {testUpd2}");
        else
            Console.WriteLine($"Update {testUpd2} error");

        repository.SaveChanges();
        Print("Updated 2");
    }
}