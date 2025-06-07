namespace ASP08_DLL
{
    public class CountryCodes : List<CountryCodes.CountryCode>
    {
        public class CountryCode
        {
            public string countryLabel { get; set; }
            public string code { get; set; }
        }
    }
}