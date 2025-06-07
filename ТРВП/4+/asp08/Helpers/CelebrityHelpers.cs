using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace asp08.Helpers
{
    public static class CelebrityHelpers
    {
        public static HtmlString CelebrityPhoto(this IHtmlHelper html, int id, string title, string src)
        {
            string href = $"location.href=/Celebrities/Human/{id}";
            string result = $@"<img id='{id}' class='celebrity-photo' title='{title}' src='{src}' 
                href='{href}' width='235' height='235' />";
            return new HtmlString(result);
        }
    }
}