using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace hunter_warfield.Core.Domain
{
    public class PersonDto
    {
        public PersonDto() { }

        public PersonDto(Person person)
        {
            Id = person.Id;
            Relationship = person.Relationship;
            Title = person.Title;
            FirstName = person.FirstName;
            MiddleName = person.MiddleName;
            LastName = person.LastName;
            Suffix = person.Suffix;
            DOB = person.DOB;
            SSN = person.SSN;
            StartDate = person.StartDate;
            EndDate = person.EndDate;
            ClaimNumber = person.ClaimNumber;
            Country = person.Country;
            Address1 = person.Address1;
            Address2 = person.Address2;
            Address3 = person.Address3;
            City = person.City;
            State = person.State;
            Zip = person.Zip;
            County = person.County;
            DebtorId = person.DebtorId;
        }

        [Key]
        public Int64 Id { get; set; }

        public Int16 Relationship { get; set; }

        public string Title { get; set; }

        public string FirstName { get; set; }

        public string MiddleName { get; set; }

        public string LastName { get; set; }

        public string Suffix { get; set; }

        public DateTime? DOB { get; set; }

        public string SSN { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public string ClaimNumber { get; set; }

        public Int16 Country { get; set; }

        public string Address1 { get; set; }

        public string Address2 { get; set; }

        public string Address3 { get; set; }

        public string City { get; set; }

        public string State { get; set; }

        public string Zip { get; set; }

        public string County { get; set; }

        public Int64 DebtorId { get; set; }

        public Person ToEntity()
        {
            return new Person
            {
                Id = Id,
                Relationship = Relationship,
                Title = Title,
                FirstName = FirstName,
                MiddleName = MiddleName,
                LastName = LastName,
                Suffix = Suffix,
                DOB = DOB,
                SSN = SSN,
                StartDate = StartDate,
                EndDate = EndDate,
                ClaimNumber = ClaimNumber,
                Country = Country,
                Address1 = Address1,
                Address2 = Address2,
                Address3 = Address3,
                City = City,
                State = State,
                Zip = Zip,
                County = County,
                DebtorId = DebtorId
            };
        }
    }
}
