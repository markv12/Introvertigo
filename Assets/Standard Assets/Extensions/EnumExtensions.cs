
using System;
using System.Collections.Generic;
using System.Linq;

namespace KingdomOfNight
{
    public static class EnumExtensions
    {
        public static TAttribute GetAttribute<TAttribute>(this Enum value)
            where TAttribute : Attribute
        {
            var type = value.GetType();
            var name = Enum.GetName(type, value);
            return type.GetField(name)
                .GetCustomAttributes(false)
                .OfType<TAttribute>()
                .SingleOrDefault();
        }

        public static IEnumerable<TEnum> Values<TEnum>()
        where TEnum : struct, IComparable, IFormattable, IConvertible
        {
            var enumType = typeof(TEnum);

            // runtime check
            if (!enumType.IsEnum)
            {
                throw new ArgumentException();
            }

            return Enum.GetValues(enumType).Cast<TEnum>();
        }
    }
}
