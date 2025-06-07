using System;

namespace DAL_Celebrity
{
    public class Lifeevent
    {
        public Lifeevent()
        {
            this.Description = string.Empty;
        }

        public int Id { get; set; }

        public int CelebrityId { get; set; }

        public DateTime Date { get; set; }

        public string Description { get; set; }

        public string? ReqPhotoPath { get; set; }

        public virtual bool Update(Lifeevent lifeevent)
        {
            this.CelebrityId = lifeevent.CelebrityId;
            this.Date = lifeevent.Date;
            this.Description = lifeevent.Description;
            this.ReqPhotoPath = lifeevent.ReqPhotoPath;
            return true;
        }
    }
}