using System;
using System.IO;
using System.Threading.Tasks;
using DAL_Celebrity;
using DAL_Celebrity_MSSQL;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Configuration;

namespace asp07.Pages
{
    public class ConfirmCelebrityModel : PageModel
    {
        private readonly IRepository<Celebrity, Lifeevent> _repository;
        private readonly IWebHostEnvironment _env;
        private readonly IConfiguration _config;

        [BindProperty]
        public string TempFilePath { get; set; }

        [BindProperty]
        public string FullName { get; set; }

        [BindProperty]
        public string Nationality { get; set; }

        public ConfirmCelebrityModel(
            IRepository<Celebrity, Lifeevent> repository,
            IWebHostEnvironment env,
            IConfiguration config)
        {
            _repository = repository;
            _env = env;
            _config = config;
        }

        public void OnGet(string tempFilePath, string fullName, string nationality)
        {
            TempFilePath = tempFilePath;
            FullName = fullName;
            Nationality = nationality;
        }

        public async Task<IActionResult> OnPostAsync()
        {
            try
            {
                // Переносим фото из временной папки
                var tempFolder = Path.Combine(_env.WebRootPath, "temp");
                var photosFolder = Path.Combine(_env.WebRootPath, "photos");
                Directory.CreateDirectory(photosFolder);

                var tempPath = Path.Combine(tempFolder, TempFilePath);
                var fileName = Path.GetFileName(TempFilePath);
                var finalPath = Path.Combine(photosFolder, fileName);

                System.IO.File.Move(tempPath, finalPath);

                // Сохраняем в БД
                var celebrity = new Celebrity
                {
                    FullName = FullName,
                    Nationality = Nationality,
                    ReqPhotoPath = $"/photos/{fileName}"
                };

                var success = _repository.AddCelebrity(celebrity);

                if (!success)
                {
                    ModelState.AddModelError("", "Ошибка сохранения в БД");
                    return Page();
                }

                return RedirectToPage("/Celebrities");
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("", $"Произошла ошибка: {ex.Message}");
                return Page();
            }
        }
    }
}