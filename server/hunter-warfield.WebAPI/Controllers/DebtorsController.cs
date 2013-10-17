using System;
using System.Collections.Generic;
using System.Linq;
using System.Data;
using System.Threading.Tasks;

using hunter_warfield.Core.Domain;
using hunter_warfield.Data.Contexts;
using hunter_warfield.Data.Repositories;
using hunter_warfield.WebAPI.Helpers;

namespace hunter_warfield.WebAPI.Controllers
{
    public class DebtorsController : BaseApiController<Debtor, DebtorDto, Int64>
    {
        public DebtorsController() { Includes = new[] { "Contacts", "Persons", "Employments", "Notes" }; }  // 

        private hwiContext db = new hwiContext();
        private hwiRepositories entity = new hwiRepositories();

        // GET api/Debtors
        //[Queryable(PageSize = 25)]
        //public override IEnumerable<DebtorDto> Get()
        //{
        //    var result = db.Set<Debtor>()
        //        .Include("Contacts")
        //        .Include("Persons")
        //        .Include("Employments")
        //        .Include("Notes")
        //        //.Where(d => d.ClientId == 159)
        //        .AsEnumerable()
        //        .Select(d => new DebtorDto(d));

        //    return result;
        //}

        public override void Put(DebtorDto value)
        {
            Debtor debtor = value.ToEntity();

            if (debtor.SSN != null && 
                debtor.SSN.Length == 9)
            {
                debtor.SSNKey = entity.Encryption(debtor.SSN);
                debtor.SSN = debtor.SSN.Substring(debtor.SSN.Length - 4, debtor.SSN.Length);
            }
            try
            {
                DataStore.Update<Debtor>(debtor);
            }
            catch (OptimisticConcurrencyException ex)
            {
                throw ex;
            }
        }

        //// GET api/Debtors/5
        //public DebtorDto GetDebtor(long id)
        //{
        //    Debtor debtor = db.Debtors.Find(id);
        //        //.Include(d => d.Contacts)
        //        //.SingleOrDefault(s => s.Id.Equals(id));

        //    if (debtor == null)
        //    {
        //        throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
        //    }

        //    return new DebtorDto(debtor);
        //}

        //// PUT api/Debtors/5
        //public HttpResponseMessage PutDebtor(long id, DebtorDto debtorDto)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
        //    }

        //    if (id != debtorDto.Id)
        //    {
        //        return Request.CreateResponse(HttpStatusCode.BadRequest);
        //    }

        //    Debtor debtor = debtorDto.ToEntity();

        //    if (db.Entry(debtor).State == EntityState.Detached)
        //    {
        //        var set = db.Set<Debtor>();
        //        Debtor attachedEntity = set.Find(debtor.Id);

        //        if (attachedEntity == null)
        //        {
        //            db.Entry(debtor).State = EntityState.Modified;
        //        }
        //        else
        //        {
        //            var attachedEntry = db.Entry(attachedEntity);
        //            attachedEntry.CurrentValues.SetValues(debtor);
        //        }
        //    }

        //    try
        //    {
        //        db.SaveChanges();
        //    }
        //    catch (DbUpdateConcurrencyException ex)
        //    {
        //        return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex);
        //    }

        //    return Request.CreateResponse(HttpStatusCode.OK);
        //}

        //// POST api/Debtors
        //public HttpResponseMessage PostDebtor(DebtorDto debtorDto)
        //{
        //    if (ModelState.IsValid)
        //    {
        //        Debtor debtor = debtorDto.ToEntity();
        //        db.Debtors.Add(debtor);
        //        db.SaveChanges();
        //        debtorDto.Id = debtor.Id;

        //        HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.Created, debtor);
        //        response.Headers.Location = new Uri(Url.Link("DefaultApi", new { id = debtorDto.Id }));
        //        return response;
        //    }
        //    else
        //    {
        //        return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
        //    }
        //}

        //// DELETE api/Debtors/5
        //public HttpResponseMessage DeleteDebtor(long id)
        //{
        //    Debtor debtor = db.Debtors.Find(id);
        //    if (debtor == null)
        //    {
        //        return Request.CreateResponse(HttpStatusCode.NotFound);
        //    }

        //    DebtorDto debtorDto = new DebtorDto(debtor);
        //    db.Debtors.Remove(debtor);

        //    try
        //    {
        //        db.SaveChanges();
        //    }
        //    catch (DbUpdateConcurrencyException ex)
        //    {
        //        return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex);
        //    }

        //    return Request.CreateResponse(HttpStatusCode.OK, debtorDto);
        //}

        //protected override void Dispose(bool disposing)
        //{
        //    db.Dispose();
        //    base.Dispose(disposing);
        //}
    }
}