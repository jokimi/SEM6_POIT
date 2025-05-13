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
    public class NewCelebrityModel : PageModel
    {
        private readonly IWebHostEnvironment _env;
        private readonly IConfiguration _config;

        [BindProperty]
        public Celebrity Celebrity { get; set; } = new();

        [BindProperty]
        public IFormFile PhotoFile { get; set; }

        public NewCelebrityModel(IWebHostEnvironment env, IConfiguration config)
        {
            _env = env;
            _config = config;
        }

        public async Task<IActionResult> OnPostAsync()
        {
            if (!ModelState.IsValid)
                return Page();

            var tempFolder = Path.Combine(_env.WebRootPath, "temp");
            Directory.CreateDirectory(tempFolder);

            var tempFileName = $"{Guid.NewGuid()}{Path.GetExtension(PhotoFile.FileName)}";
            var tempFilePath = Path.Combine(tempFolder, tempFileName);

            using (var stream = new FileStream(tempFilePath, FileMode.Create))
            {
                await PhotoFile.CopyToAsync(stream);
            }

            return RedirectToPage("ConfirmCelebrity", new
            {
                tempFilePath = tempFileName,
                fullName = Celebrity.FullName,
                nationality = Celebrity.Nationality
            });
        }
    }
}