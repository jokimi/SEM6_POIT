using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Reflection.Emit;
using DAL_Celebrity;
using Microsoft.EntityFrameworkCore;

namespace DAL_Celebrity_MSSQL
{
    public class Repository : IRepository<Celebrity, Lifeevent>
    {
        private readonly Context _context;

        public Repository()
        {
            _context = new Context();
        }

        public Repository(string connectionString)
        {
            _context = new Context(connectionString);
        }

        public static IRepository<Celebrity, Lifeevent> Create() => new Repository();
        public static IRepository<Celebrity, Lifeevent> Create(string connectionString) => new Repository(connectionString);

        public List<Celebrity> GetAllCelebrities() => _context.Celebrities.ToList();

        public Celebrity? GetCelebrityById(int id) => _context.Celebrities.Find(id);

        public bool AddCelebrity(Celebrity celebrity)
        {
            _context.Celebrities.Add(celebrity);
            return _context.SaveChanges() > 0;
        }

        public bool DelCelebrity(int id)
        {
            var celebrity = _context.Celebrities.Find(id);
            if (celebrity != null)
            {
                _context.Celebrities.Remove(celebrity);
                return _context.SaveChanges() > 0;
            }
            return false;
        }

        public bool UpdCelebrity(int id, Celebrity celebrity)
        {
            var existingCelebrity = _context.Celebrities.Find(id);
            if (existingCelebrity != null)
            {
                existingCelebrity.Update(celebrity);
                return _context.SaveChanges() > 0;
            }
            return false;
        }

        public List<Lifeevent> GetAllLifeevents() => _context.Lifeevents.ToList();

        public Lifeevent? GetLifeevetById(int id) => _context.Lifeevents.Find(id);

        public bool AddLifeevent(Lifeevent lifeevent)
        {
            _context.Lifeevents.Add(lifeevent);
            return _context.SaveChanges() > 0;
        }

        public bool DelLifeevent(int id)
        {
            var lifeevent = _context.Lifeevents.Find(id);
            if (lifeevent != null)
            {
                _context.Lifeevents.Remove(lifeevent);
                return _context.SaveChanges() > 0;
            }
            return false;
        }

        public bool UpdLifeevent(int id, Lifeevent lifeevent)
        {
            var existingLifeevent = _context.Lifeevents.Find(id);
            if (existingLifeevent != null)
            {
                existingLifeevent.Update(lifeevent);
                return _context.SaveChanges() > 0;
            }
            return false;
        }

        public List<Lifeevent> GetLifeeventsByCelebrityId(int celebrityId)
            => _context.Lifeevents.Where(le => le.CelebrityId == celebrityId).ToList();

        public Celebrity? GetCelebrityByLifeeventId(int lifeeventId)
        {
            var lifeevent = _context.Lifeevents.Find(lifeeventId);
            return lifeevent != null ? _context.Celebrities.Find(lifeevent.CelebrityId) : null;
        }

        public int GetCelebrityIdByName(string name)
            => _context.Celebrities
                .Where(c => c.FullName.Contains(name))
                .Select(c => c.Id)
                .FirstOrDefault();

        public void Dispose()
        {
            _context?.Dispose();
        }
    }

    public class Context : Microsoft.EntityFrameworkCore.DbContext
    {
        public string? ConnectionString { get; private set; } = null;

        public Context(string connString) : base()
        {
            ConnectionString = connString;
        }

        public Context() : base() { }

        public Microsoft.EntityFrameworkCore.DbSet<Celebrity> Celebrities { get; set; }
        public Microsoft.EntityFrameworkCore.DbSet<Lifeevent> Lifeevents { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (ConnectionString == null)
            {
                ConnectionString = @"Data Source=DESKTOP-3SMK9QM;Initial Catalog=LEC;Integrated Security=True;TrustServerCertificate=True;";
            }
            optionsBuilder.UseSqlServer(ConnectionString);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Celebrity>()
                .ToTable("Celebrities")
                .HasKey(c => c.Id);
            modelBuilder.Entity<Celebrity>()
                .Property(c => c.FullName)
                .IsRequired()
                .HasMaxLength(50);
            modelBuilder.Entity<Celebrity>()
                .Property(c => c.Nationality)
                .IsRequired()
                .HasMaxLength(2);
            modelBuilder.Entity<Celebrity>()
                .Property(c => c.ReqPhotoPath)
                .HasMaxLength(200);

            modelBuilder.Entity<Lifeevent>()
                .ToTable("Lifeevents")
                .HasKey(le => le.Id);
            modelBuilder.Entity<Lifeevent>()
                .Property(le => le.CelebrityId)
                .IsRequired();
            modelBuilder.Entity<Lifeevent>()
                .Property(le => le.Date);
            modelBuilder.Entity<Lifeevent>()
                .Property(le => le.Description)
                .HasMaxLength(256);
            modelBuilder.Entity<Lifeevent>()
                .Property(le => le.ReqPhotoPath)
                .HasMaxLength(256);
            modelBuilder.Entity<Lifeevent>()
                .HasOne<Celebrity>()
                .WithMany()
                .HasForeignKey(le => le.CelebrityId);

            base.OnModelCreating(modelBuilder);
        }
    }
}