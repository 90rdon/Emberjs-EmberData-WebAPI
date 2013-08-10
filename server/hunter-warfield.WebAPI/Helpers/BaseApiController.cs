//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Web;
//using System.Web.Http;

//using hunter_warfield.Core.Interfaces;

//namespace hunter_warfield.WebAPI.Helpers
//{
//    public class BaseApiController<T> : ApiController where T : class, IIdentifier
//    {
//        protected IGenericRepository DataStore { get; set; }
//        protected string[] Includes { get; set; }

//        public BaseApiController()
//        {
//            //TODO: USE DEPENDENCY INJECTION FOR DECOUPLING
//            this.DataStore = new EFRepository();
//        }

//        // GET api/<controller>
//        public virtual IEnumerable<T> Get()
//        {
//            return DataStore.All<T>(Includes);
//        }

//        // GET api/<controller>/5
//        public virtual T Get(int id)
//        {
//            return DataStore.Find<T>(t => t.ID == id, Includes);
//        }

//        // POST api/<controller>
//        public virtual void Post([FromBody]T value)
//        {
//            try
//            {
//                DataStore.Update<T>(value);
//            }
//            catch (OptimisticConcurrencyException ex)
//            {
//                throw ex;
//            }
//        }

//        // PUT api/<controller>
//        public virtual void Put([FromBody]T value)
//        {
//            DataStore.Create<T>(value);
//        }

//        // DELETE api/<controller>/5
//        public virtual void Delete(int id)
//        {
//            DataStore.Delete<T>(t => t.ID == id);
//        }

//        public virtual void Delete([FromBody]T value)
//        {
//            Delete(value.ID);
//        }

//        protected IEnumerable GetModelErrors()
//        {
//            return this.ModelState.SelectMany(x => x.Value.Errors.Select(error => error.ErrorMessage));
//        }
//    }
//}