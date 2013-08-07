using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Linq;
using System.Data.Entity;
using System.Collections.Generic;

using hunter_warfield.Core.Domain;
using hunter_warfield.Data.Contexts;
using hunter_warfield.Data.Repositories;

namespace hunter_warfield.data.Tests
{
    [TestClass]
    public class UnitTest
    {
        [TestInitialize()]
        public void Initialize()
        {
            Database.SetInitializer<hwiContext>(null);
        }

        [TestMethod]
        public void GetConnection()
        {
            using (var db = new hwiContext())
            {
                Assert.IsTrue(db != null);
            }
        }

        [TestMethod]
        public void GetDebtor()
        {
            using (var db = new hwiContext())
            {
                var entity = new GenericRepository<Debtor>();
                var debtors = entity.GetAll().Include(d => d.Contacts).FirstOrDefault();

                Assert.IsTrue(debtors != null);
            }
        }

        [TestMethod]
        public void GetContact()
        {
            using (var db = new hwiContext())
            {
                var entity = new GenericRepository<Contact>();
                var contact = entity.GetAll().FirstOrDefault();

                Assert.IsTrue(contact != null);
            }
        }
    }
}
