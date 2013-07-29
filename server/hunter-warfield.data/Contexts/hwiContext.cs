using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity;
using System.Data.Metadata.Edm;
using System.Data.Entity.ModelConfiguration.Conventions;

using hunter_warfield.core.Domain;
using hunter_warfield.data.Configurations;

namespace hunter_warfield.data.Contexts
{
    public class hwiContext : DbContext
    {
        public hwiContext() : base("hwi") { }

        public hwiContext(string connectionString) : base(connectionString) { }

        public DbSet<Debtor> Debtors { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Configurations.Add(new DebtorConfiguration());
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
            base.OnModelCreating(modelBuilder);
        }
    }
}
