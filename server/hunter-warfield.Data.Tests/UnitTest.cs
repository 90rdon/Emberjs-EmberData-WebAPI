using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Linq;
using System.Data.Entity;
using System.Collections.Generic;

using hunter_warfield.Core.Domain;
using hunter_warfield.Data.Contexts;
using hunter_warfield.Data.Repositories;

namespace hunter_warfield.Data.Tests
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
        public void GetEFConnection()
        {
            using (var db = new hwiContext())
            {
                Assert.IsTrue(db != null);
            }
        }

        [TestMethod]
        public void GetDebtorEntity()
        {
            using (var db = new hwiContext())
            {
                var entity = new EFRepository();
                var debtors = entity.All<Debtor>(new string[]{"Contacts"}).FirstOrDefault();

                Assert.IsTrue(debtors != null);
            }
        }

        [TestMethod]
        public void GetContactEntity()
        {
            using (var db = new hwiContext())
            {
                var entity = new EFRepository();
                var contact = entity.All<Contact>().FirstOrDefault();

                Assert.IsTrue(contact != null);
            }
        }

        [TestMethod]
        public void GetPersonEntity()
        {
            using (var db = new hwiContext())
            {
                var entity = new EFRepository();
                var person = entity.All<Person>().FirstOrDefault();

                Assert.IsTrue(person != null);
            }
        }

        [TestMethod]
        public void GetEmploymentEntity()
        {
            using (var db = new hwiContext())
            {
                var entity = new EFRepository();
                var employment = entity.All<Employment>().FirstOrDefault();

                Assert.IsTrue(employment != null);
            }
        }

        [TestMethod]
        public void GetHistoricalEntity()
        {
            using (var db = new hwiContext())
            {
                var entity = new EFRepository();
                var historical = entity.All<Historical>().FirstOrDefault();

                Assert.IsTrue(historical != null);
            }
        }
    }
}
