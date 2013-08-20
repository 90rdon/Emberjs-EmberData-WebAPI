using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Data.Entity;

using hunter_warfield.Core.Interfaces;
using hunter_warfield.Data.Repositories;

namespace hunter_warfield.WebAPI.Helpers
{
    // Class type T is the Entity Framework data object type
    // Class type O is the Data Transform Object(DTO) type
    public class BaseApiController<T, O, I> : ApiController 
        where T : class, IIdentifier<I>
        where O : new()
    {
        protected IGenericRepository DataStore { get; set; }
        protected string[] Includes { get; set; }

        public BaseApiController()
        {
            //TODO: USE DEPENDENCY INJECTION FOR DECOUPLING
            this.DataStore = new EFRepository<I>();
        }

        // GET api/<controller>
        public virtual IEnumerable<O> Get()
        {
            return DataStore.All<T>(Includes)
                .AsEnumerable()
                .Select(t => GetObject(t));
        }

        // GET api/<controller>/5
        public virtual O Get(I id)
        {
            return GetObject(DataStore.Find<T>(t => (object)t.Id == (object)id, Includes));
        }

        // POST api/<controller>
        public virtual O Post([FromBody]O value)
        {
            return GetObject(DataStore.Create<T>((value as IDataTransfer<T>).ToEntity()));
        }

        // PUT api/<controller>
        public virtual void Put([FromBody]O value)
        {
            try
            {
                DataStore.Update<T>((value as IDataTransfer<T>).ToEntity());
            }
            catch (OptimisticConcurrencyException ex)
            {
                throw ex;
            }
        }

        // DELETE api/<controller>/5
        public virtual void Delete(I id)
        {
            DataStore.Delete<T>(t => (object)t.Id == (object)id);
        }

        public virtual void Delete([FromBody]O value)
        {
            Delete((value as IDataTransfer<T>).ToEntity().Id);
        }

        private O GetObject(params T[] arg)
        {
            return (O)Activator.CreateInstance(typeof(O), arg);
        }
    }
}