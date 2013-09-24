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

        public DbSet<Client> Clients { get; set; }
        public DbSet<Debtor> Debtors { get; set; }
        public DbSet<Contact> Contacts { get; set; }
        public DbSet<Person> Persons { get; set; }
        public DbSet<Employment> Employments { get; set; }
        public DbSet<Country> Countries { get; set; }
        public DbSet<Relationship> Relationships { get; set; }
        public DbSet<Association> Associations { get; set; }
        public DbSet<Note> Notes { get; set; }
        public DbSet<ActionCode> ActionCodes { get; set; }
        public DbSet<ResultCode> ResultCodes { get; set; }
        public DbSet<OperatingTransaction> OperatingTransactions { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Configurations.Add(new ClientConfiguration());
            modelBuilder.Configurations.Add(new DebtorConfiguration());
            modelBuilder.Configurations.Add(new ContactConfiguration());
            modelBuilder.Configurations.Add(new PersonConfiguration());
            modelBuilder.Configurations.Add(new EmploymentConfiguration());
            modelBuilder.Configurations.Add(new CountryConfiguration());
            modelBuilder.Configurations.Add(new RelationshipConfiguration());
            modelBuilder.Configurations.Add(new AssociationConfiguration());
            modelBuilder.Configurations.Add(new NoteConfiguration());
            modelBuilder.Configurations.Add(new ActionCodeConfiguration());
            modelBuilder.Configurations.Add(new ResultCodeConfiguration());
            modelBuilder.Configurations.Add(new OperatingTransactionConfiguration());


            modelBuilder.Entity<Client>()
                .HasMany(d => d.Debtors)
                .WithOptional()
                .HasForeignKey(f => f.ClientId);

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
                .HasMany(d => d.Notes)
                .WithOptional()
                .HasForeignKey(f => f.DebtorId);

            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
            base.OnModelCreating(modelBuilder);
        }
    }
}
