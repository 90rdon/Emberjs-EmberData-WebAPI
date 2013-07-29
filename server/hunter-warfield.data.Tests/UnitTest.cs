using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Linq;
using System.Data.Entity;
using System.Collections.Generic;

using hunter_warfield.core.Domain;
using hunter_warfield.data.Contexts;
using hunter_warfield.data.Repositories;

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
                var debtors = entity.GetAll().FirstOrDefault();

                Assert.IsTrue(debtors != null);
            }
        }
    }
}
