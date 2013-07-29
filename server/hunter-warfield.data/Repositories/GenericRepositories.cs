using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using hunter_warfield.core.Interfaces;
using hunter_warfield.data.Contexts;

namespace hunter_warfield.data.Repositories
{
    public class GenericRepository<T> : IGenericRepository<T>
        where T : class
    {
        private hwiContext _entities = new hwiContext();
        public hwiContext Context
        {

            get { return _entities; }
            set { _entities = value; }
        }

        public IQueryable<T> GetAll()
        {
            IQueryable<T> query = _entities.Set<T>();
            return query;
        }

        public IQueryable<T> FindBy(System.Linq.Expressions.Expression<Func<T, bool>> predicate)
        {
            IQueryable<T> query = _entities.Set<T>().Where(predicate);
            return query;
        }

        public void Insert(T entity)
        {
            _entities.Set<T>().Add(entity);
        }

        public void Delete(T entity)
        {
            _entities.Set<T>().Remove(entity);
        }

        public void Update(T entity)
        {
            _entities.Entry(entity).State = System.Data.EntityState.Modified;
        }

        public void Save()
        {
            _entities.SaveChanges();
        }
    }
}
