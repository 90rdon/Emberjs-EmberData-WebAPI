using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace hunter_warfield.Core.Domain
{
    public class DebtorDto
    {
        public DebtorDto() { }

        public DebtorDto(Debtor debtor)
        {
            Id = debtor.Id;
            Type = debtor.Type;
            Title = debtor.Title;
            FirstName = debtor.FirstName;
            MiddleName = debtor.MiddleName;
            LastName = debtor.LastName;
            Suffix = debtor.Suffix;
            DOB = debtor.DOB;
            SSN = debtor.SSN;
            MaritalStatus = debtor.MaritalStatus;
            Email = debtor.Email;
            EmailValidity = debtor.EmailValidity;
            OptIn = debtor.OptIn;
            CommContact = debtor.Contact;
            Country = debtor.Country;
            Address1 = debtor.Address1;
            Address2 = debtor.Address2;
            Address3 = debtor.Address3;
            City = debtor.City;
            State = debtor.State;
            Zip = debtor.Zip;
            County = debtor.County;
            DLIssuer = debtor.DLIssuer;
            DLNumber = debtor.DLNumber;
            Passport = debtor.Passport;
            PIN = debtor.PIN;
            Contacts = new List<ContactDto>();
            foreach (Contact contact in debtor.Contacts)
            {
                Contacts.Add(new ContactDto(contact));
            }
        }

        [Key]
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

        public string CommContact { get; set; }

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

        public virtual List<ContactDto> Contacts { get; set; }

        public Debtor ToEntity()
        {
            Debtor debtor = new Debtor
            {
                Id = Id,
                Type = Type,
                Title = Title,
                FirstName = FirstName,
                MiddleName = MiddleName,
                LastName = LastName,
                Suffix = Suffix,
                DOB = DOB,
                SSN = SSN,
                MaritalStatus = MaritalStatus,
                Email = Email,
                EmailValidity = EmailValidity,
                OptIn = OptIn,
                Contact = CommContact,
                Country = Country,
                Address1 = Address1,
                Address2 = Address2,
                Address3 = Address3,
                City = City,
                State = State,
                Zip = Zip,
                County = County,
                DLIssuer = DLIssuer,
                DLNumber = DLNumber,
                Passport = Passport,
                PIN = PIN,
                Contacts = new List<Contact>()
            };

            if (Contacts != null)
            {
                foreach (ContactDto contact in Contacts)
                {
                    debtor.Contacts.Add(contact.ToEntity());
                }
            }

            return debtor;
        }
    }
}
