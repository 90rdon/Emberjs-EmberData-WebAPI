using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using hunter_warfield.Core.Interfaces;

namespace hunter_warfield.Core.Domain
{
    public partial class Debtor : IIdentifier
    {
        public Int64 Id { get; set; }

        public string Type { get; set; }

        public string Title { get; set; }

        public string FirstName { get; set; }

        public string MiddleName { get; set; }

        public string LastName { get; set; }

        public string Suffix { get; set; }

        public DateTime? DOB { get; set; }

        public string SSN { get; set; }

        public Int16 MaritalStatus { get; set; }

        public string Email { get; set; }

        public Int32? EmailValidity { get; set; }

        public string OptIn { get; set; }

        //public string EIN { get; set; }

        public string Contact { get; set; }

        public Int16 Country { get; set; }

        public string Address1 { get; set; }

        public string Address2 { get; set; }

        public string Address3 { get; set; }

        public string City { get; set; }

        public string State { get; set; }

        public string Zip { get; set; }

        public string County { get; set; }

        public string DLIssuer { get; set; }

        public string DLNumber { get; set; }

        public string Passport { get; set; }

        public string PIN { get; set; }

        public virtual List<Contact> Contacts { get; set; }

        public virtual List<Person> Persons { get; set; }

        public virtual List<Employment> Employments { get; set; }

        public virtual List<Historical> Historicals { get; set; }
    }
}
