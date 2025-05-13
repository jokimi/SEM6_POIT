using DAL_Celebrity;
using DAL_Celebrity_MSSQL;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace asp07.Pages
{
    public class CelebritiesModel : PageModel
    {
        private readonly IRepository<Celebrity, Lifeevent> _repository;
        private readonly IConfiguration _config;

        public List<Celebrity> Celebrities { get; set; }
        public string PhotosRequestPath => _config["PhotosRequestPath"];

        public CelebritiesModel(IRepository<Celebrity, Lifeevent> repository, IConfiguration config)
        {
            _repository = repository;
            _config = config;
        }

        public void OnGet()
        {
            Celebrities = _repository.GetAllCelebrities();
        }
    }
}