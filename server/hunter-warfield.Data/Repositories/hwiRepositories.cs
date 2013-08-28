using System;
using System.Collections.Generic;
using System.Collections;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using hunter_warfield.Core.Domain;
using hunter_warfield.Core.Interfaces;
using hunter_warfield.Data.Contexts;

namespace hunter_warfield.Data.Repositories
{
    public class hwiRepositories
    {
        private hwiContext dbContext;

        public hwiRepositories()
        {
            dbContext = new hwiContext();
        }

        public string Encryption(string data)
        {
            StringBuilder sql = new StringBuilder();
            sql.Append("SELECT");
            sql.Append("    dbo.fn_encrypt_data(");
            sql.Append("        '{0}',");
            sql.Append("        'b3d3e1c9d9ab2753ca5a7ac09cd1badc9beb50c106b46f944d9bf81be4724fac79c436b8fb74785537e6e91bb3ebb950e4fd31f384d526aeaaf17d8fa9ef515e',");
            sql.Append("        'PERSONID'");
            sql.Append("    ) AS SSN");

            using (var db = new hwiContext())
            {
                var result = db.Database.SqlQuery<string>(string.Format(sql.ToString(), data));

                return result.ToList().First().ToString();
            }
        }

        public string Decryption(string data)
        {
            StringBuilder key = new StringBuilder();
            key.Append("SELECT");
            key.Append("    cnsmr_idntfr_scrd_ssn_txt");
            key.Append("  FROM dbo.cnsmr");
            key.Append("  WHERE cnsmr_id = {0}");

            StringBuilder sql = new StringBuilder();
            sql.Append("SELECT");
            sql.Append("    dbo.fn_decrypt_data(");
            sql.Append("        ({0}),");
            sql.Append("        'b3d3e1c9d9ab2753ca5a7ac09cd1badc9beb50c106b46f944d9bf81be4724fac79c436b8fb74785537e6e91bb3ebb950e4fd31f384d526aeaaf17d8fa9ef515e',");
            sql.Append("        'PERSONID'");
            sql.Append("    ) AS SSN");

            using (var db = new hwiContext())
            {
                var result = db.Database.SqlQuery<string>(string.Format(sql.ToString(), string.Format(key.ToString(), data)));

                return result.ToList().First().ToString();
            }
        }
    }
}
