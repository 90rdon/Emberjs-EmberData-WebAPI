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
using hunter_warfield.core.Domain;
using hunter_warfield.data.Contexts;

namespace hunter_warfield.server.Controllers
{
    public class DebtorsController : ApiController
    {
        private hwiContext db = new hwiContext();

        // GET api/Debtors
        public IEnumerable<Debtor> GetDebtors()
        {
            return db.Debtors.AsEnumerable();
        }

        // GET api/Debtors/5
        public Debtor GetDebtor(long id)
        {
            Debtor debtor = db.Debtors.Find(id);
            if (debtor == null)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            }

            return debtor;
        }

        // PUT api/Debtors/5
        public HttpResponseMessage PutDebtor(long id, Debtor debtor)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }

            if (id != debtor.Id)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }

            db.Entry(debtor).State = EntityState.Modified;

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
        public HttpResponseMessage PostDebtor(Debtor debtor)
        {
            if (ModelState.IsValid)
            {
                db.Debtors.Add(debtor);
                db.SaveChanges();

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.Created, debtor);
                response.Headers.Location = new Uri(Url.Link("DefaultApi", new { id = debtor.Id }));
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

            db.Debtors.Remove(debtor);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex);
            }

            return Request.CreateResponse(HttpStatusCode.OK, debtor);
        }

        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }
    }
}