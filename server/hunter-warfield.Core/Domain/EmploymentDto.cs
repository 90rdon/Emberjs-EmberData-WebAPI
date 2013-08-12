using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using hunter_warfield.Core.Interfaces;

namespace hunter_warfield.Core.Domain
{
    public partial class EmploymentDto : IDataTransfer<Employment>
    {
        public EmploymentDto() { }

        public EmploymentDto(Employment employment)
        {
            if (employment == null) return;
            Id = employment.Id;
            Relationship = employment.Relationship;
            Name = employment.Name;
            MonthlyNetIncome = employment.MonthlyNetIncome;
            Position = employment.Position;
            HireDate = employment.HireDate;
            Phone = employment.Phone;
            Website = employment.Website;
            Status = employment.Status;
            Source = employment.Source;
            Country = employment.Country;
            Address1 = employment.Address1;
            Address2 = employment.Address2;
            Address3 = employment.Address3;
            City = employment.City;
            State = employment.State;
            Zip = employment.Zip;
            County = employment.County;
            JobTitle = employment.JobTitle;
            TerminationDate = employment.TerminationDate;
            YearlyIncome = employment.YearlyIncome;
            MonthlyGrossIncome = employment.MonthlyGrossIncome;
            DebtorId = employment.DebtorId;
        }

        [Key]
        public Int64 Id { get; set; }

        public Int16? Relationship { get; set; }

        public string Name { get; set; }

        public decimal MonthlyNetIncome { get; set; }

        public string Position { get; set; }

        public DateTime? HireDate { get; set; }

        public string Phone { get; set; }

        public string Website { get; set; }

        public Int16? Status { get; set; }

        public Int16? Source { get; set; }

        public Int16? Country { get; set; }

        public string Address1 { get; set; }

        public string Address2 { get; set; }

        public string Address3 { get; set; }

        public string City { get; set; }

        public string State { get; set; }

        public string Zip { get; set; }

        public string County { get; set; }

        public string JobTitle { get; set; }

        public DateTime? TerminationDate { get; set; }

        public decimal YearlyIncome { get; set; }

        public decimal MonthlyGrossIncome { get; set; }

        public Int64 DebtorId { get; set; }

        public Employment ToEntity()
        {
            return new Employment
            {
                Id = Id,
                Relationship = Relationship,
                Name = Name,
                MonthlyNetIncome = MonthlyNetIncome,
                Position = Position,
                HireDate = HireDate,
                Phone = Phone,
                Website = Website,
                Status = Status,
                Source = Source,
                Country = Country,
                Address1 = Address1,
                Address2 = Address2,
                Address3 = Address3,
                City = City,
                State = State,
                Zip = Zip,
                County = County,
                JobTitle = JobTitle,
                TerminationDate = TerminationDate,
                YearlyIncome = YearlyIncome,
                MonthlyGrossIncome = MonthlyGrossIncome,
                DebtorId = DebtorId
            };
        }
    }
}
