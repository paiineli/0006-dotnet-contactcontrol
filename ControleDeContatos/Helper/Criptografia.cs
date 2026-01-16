using System.Security.Cryptography;
using System.Text;

namespace ControleDeContatos.Helper
{
    public static class Criptografia
    {
        public static string GerarHash(this string valor)
        {
            using (var hash = SHA256.Create())
            {
                var encoding = new UTF8Encoding();
                var array = encoding.GetBytes(valor);
                array = hash.ComputeHash(array);
                var strHexa = new StringBuilder();

                foreach (var item in array)
                {
                    strHexa.Append(item.ToString("x2"));
                }

                return strHexa.ToString();
            }
        }
    }
}