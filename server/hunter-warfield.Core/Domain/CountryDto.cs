﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using hunter_warfield.Core.Interfaces;

namespace hunter_warfield.Core.Domain
{
    public partial class CountryDto : IDataTransfer<Country>
    {
        public CountryDto() { }

        public CountryDto(Country country)
        {
            if (country == null) return;
            Id = country.Id;
            Label = country.Label;
        }

        [Key]
        public Int16 Id { get; set; }

        public string Label { get; set; }

        public Country ToEntity()
        {
            return new Country
            {
                Id = Id,
                Label = Label
            };
        }
    }
}
