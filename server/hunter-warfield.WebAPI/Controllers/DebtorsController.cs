using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
//using System.Web.Http.OData;

using StackExchange.Profiling;

using hunter_warfield.Core.Domain;
using hunter_warfield.Data.Contexts;

namespace hunter_warfield.WebAPI.Controllers
{
    public class DebtorsController : ApiController //EntitySetController<Debtor, Int32>
    {
        private hwiContext db = new hwiContext();

        // GET api/Debtors
        //[Queryable(PageSize = 25)]
        public IEnumerable<DebtorDto> GetDebtors()
        {
            return db.Debtors.Take(25)
                .AsEnumerable()
                .Select(debtor => new DebtorDto(debtor));
        }

        // GET api/Debtors/5
        public DebtorDto GetDebtor(long id)
        {
            Debtor debtor = db.Debtors.Find(id);
                //.Include(d => d.Contacts)
                //.SingleOrDefault(s => s.Id.Equals(id));

            if (debtor == null)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            }

            return new DebtorDto(debtor);
        }

        // PUT api/Debtors/5
        public HttpResponseMessage PutDebtor(long id, DebtorDto debtorDto)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }

            if (id != debtorDto.Id)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }

            Debtor debtor = debtorDto.ToEntity();

            if (db.Entry(debtor).State == EntityState.Detached)
            {
                var set = db.Set<Debtor>();
                Debtor attachedEntity = set.Find(debtor.Id);

                if (attachedEntity == null)
                {
                    db.Entry(debtor).State = EntityState.Modified;
                }
                else
                {
                    var attachedEntry = db.Entry(attachedEntity);
                    attachedEntry.CurrentValues.SetValues(debtor);
                }
            }

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex);
            }

            return Request.CreateResponse(HttpStatusCode.OK);
        }

        // POST api/Debtors
        public HttpResponseMessage PostDebtor(DebtorDto debtorDto)
        {
            if (ModelState.IsValid)
            {
                Debtor debtor = debtorDto.ToEntity();
                db.Debtors.Add(debtor);
                db.SaveChanges();
                debtorDto.Id = debtor.Id;

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.Created, debtor);
                response.Headers.Location = new Uri(Url.Link("DefaultApi", new { id = debtorDto.Id }));
                return response;
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
        }

        // DELETE api/Debtors/5
        public HttpResponseMessage DeleteDebtor(long id)
        {
            Debtor debtor = db.Debtors.Find(id);
            if (debtor == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            DebtorDto debtorDto = new DebtorDto(debtor);
            db.Debtors.Remove(debtor);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex);
            }

            return Request.CreateResponse(HttpStatusCode.OK, debtorDto);
        }

        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }
    }
}