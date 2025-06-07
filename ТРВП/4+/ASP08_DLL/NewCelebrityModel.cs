using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using Microsoft.AspNetCore.Mvc.Rendering;

public class NewCelebrityModel
{
    [Required(ErrorMessage = "Введите полное имя")]
    public string FullName { get; set; }

    [Required(ErrorMessage = "Выберите национальность")]
    public string Nationality { get; set; }

    [Required(ErrorMessage = "Выберите фотографию")]
    [DataType(DataType.Upload)]
    public IFormFile Photo { get; set; }

    [ValidateNever]
    public SelectList CountryList { get; set; }
}