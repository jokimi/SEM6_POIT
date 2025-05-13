using DAL_Celebrity;
using DAL_Celebrity_MSSQL;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Configuration;

namespace asp07.Pages
{
    public class CelebrityModel : PageModel
    {
        private readonly IRepository<Celebrity, Lifeevent> _repository;
        private readonly IConfiguration _config;

        public Celebrity? Celebrity { get; set; }
        public List<Lifeevent> Lifeevents { get; set; } = new();
        public string PhotosRequestPath { get; set; }

        public CelebrityModel(IRepository<Celebrity, Lifeevent> repository, IConfiguration config)
        {
            _repository = repository;
            _config = config;
            PhotosRequestPath = _config["PhotosRequestPath"];
        }

        public void OnGet(int id)
        {
            Celebrity = _repository.GetCelebrityById(id);
            if (Celebrity != null)
            {
                Lifeevents = _repository.GetLifeeventsByCelebrityId(id);
            }
        }
    }
}