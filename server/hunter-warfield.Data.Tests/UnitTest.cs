using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Linq;
using System.Linq.Expressions;
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
                var entity = new EFRepository<Int64>();
                var debtors = entity.All<Debtor>(new string[]{"Contacts"}).FirstOrDefault();

                Assert.IsTrue(debtors != null);
            }
        }

        [TestMethod]
        public void CreateDebtorEntity()
        {
            using (var db = new hwiContext())
            {
                var entity = new hwiRepositories();
                //var debtor = 

                Assert.IsTrue( true);
            }
        }

        [TestMethod]
        public void GetContactEntity()
        {
            using (var db = new hwiContext())
            {
                var entity = new EFRepository<Int64>();
                var contact = entity.All<Contact>().FirstOrDefault();

                Assert.IsTrue(contact != null);
            }
        }

        [TestMethod]
        public void GetPersonEntity()
        {
            using (var db = new hwiContext())
            {
                var entity = new EFRepository<Int64>();
                var person = entity.All<Person>().FirstOrDefault();

                Assert.IsTrue(person != null);
            }
        }

        [TestMethod]
        public void GetEmploymentEntity()
        {
            using (var db = new hwiContext())
            {
                var entity = new EFRepository<Int64>();
                var employment = entity.All<Employment>().FirstOrDefault();

                Assert.IsTrue(employment != null);
            }
        }

        [TestMethod]
        public void GetNoteEntity()
        {
            using (var db = new hwiContext())
            {
                var entity = new EFRepository<Int64>();
                var note = entity.All<Note>().FirstOrDefault();

                Assert.IsTrue(note != null);
            }
        }

        [TestMethod]
        public void GetCountrysEntity()
        {
            using (var db = new hwiContext())
            {
                var entity = new EFRepository<Int16>();
                var country = entity.All<Country>();

                Assert.IsTrue(country != null);
            }
        }

        [TestMethod]
        public void GetClientEntity()
        {
            using (var db = new hwiContext())
            {
                var entity = new EFRepository<Int64>();
                var client = entity.Find<Client>(c => c.LegacyId.Equals("26765"), new string[] { "Debtors" });

                Assert.IsTrue(client != null);
                Assert.IsTrue(client.Debtors.FirstOrDefault() != null);
            }
        }

        [TestMethod]
        public void GetRelationshipEntity()
        {
            using (var db = new hwiContext())
            {
                var entity = new EFRepository<Int16>();
                var relationship = entity.All<Relationship>();

                Assert.IsTrue(relationship.FirstOrDefault() != null);
            }
        }

        [TestMethod]
        public void GetEncryptionEntity()
        {
            //using (var db = new hwiContext())
            //{
            //    var result = db.Database.SqlQuery<string>("SELECT dbo.fn_encrypt_data('123456789','b3d3e1c9d9ab2753ca5a7ac09cd1badc9beb50c106b46f944d9bf81be4724fac79c436b8fb74785537e6e91bb3ebb950e4fd31f384d526aeaaf17d8fa9ef515e','PERSONID') AS SSN");

            //    Assert.IsTrue(true);
            //}

            hwiRepositories entity = new hwiRepositories();

            var result = entity.Encryption("123456789");
            Assert.IsTrue(true);
        }


        [TestMethod]
        public void GetDecryptionEntity()
        {
            //string encryption = "0x01000000b992ceff8bfb1aa701099b103bb49b14ccc1eedff5704b957deab4060d9f719d91f62728128757972c61dad87eaa4698df94af30d10a57ab";
            int id = 4103754;
            string sql = string.Format("SELECT [cnsmr_idntfr_scrd_ssn_txt] FROM [dbo].[cnsmr] WHERE [cnsmr_id] = {0}", id);

            using (var db = new hwiContext())
            {
                var result = db.Database.SqlQuery<string>(string.Format("SELECT dbo.fn_decrypt_data(({0}),'b3d3e1c9d9ab2753ca5a7ac09cd1badc9beb50c106b46f944d9bf81be4724fac79c436b8fb74785537e6e91bb3ebb950e4fd31f384d526aeaaf17d8fa9ef515e','PERSONID') AS SSN", sql));

                Assert.IsTrue(true);
            }
        }

        
        [TestMethod]
        public void GetCurrentBalance()
        {
            Int64 id = 2528019;
            hwiRepositories entity = new hwiRepositories();
            var result = entity.DebtorBalance(id);

            Assert.IsTrue(result == 4120);
        }
    }
}
