using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;

using hunter_warfield.Core.Domain;
using hunter_warfield.Data.Configurations;

namespace hunter_warfield.Data.Contexts
{
    public class hwiContext : DbContext
    {
        public hwiContext() : base("hwi") { }

        public hwiContext(string connectionString) { }

        public DbSet<Debtor> Debtors { get; set; }
        public DbSet<Contact> Contacts { get; set; }
        public DbSet<Person> Persons { get; set; }
        public DbSet<Employment> Employments { get; set; }
        public DbSet<Historical> Historicals { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Configurations.Add(new DebtorConfiguration());
            modelBuilder.Configurations.Add(new ContactConfiguration());
            modelBuilder.Configurations.Add(new PersonConfiguration());
            modelBuilder.Configurations.Add(new EmploymentConfiguration());
            modelBuilder.Configurations.Add(new HistoricalConfiguration());


            modelBuilder.Entity<Debtor>()
                .HasMany(d => d.Contacts)
                .WithOptional()
                .HasForeignKey(f => f.DebtorId);

            modelBuilder.Entity<Debtor>()
                .HasMany(d => d.Persons)
                .WithOptional()
                .HasForeignKey(f => f.DebtorId);

            modelBuilder.Entity<Debtor>()
                .HasMany(d => d.Employments)
                .WithOptional()
                .HasForeignKey(f => f.DebtorId);

            modelBuilder.Entity<Debtor>()
                .HasMany(d => d.Historicals)
                .WithOptional()
                .HasForeignKey(f => f.DebtorId);

            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
            base.OnModelCreating(modelBuilder);
        }
    }
}
