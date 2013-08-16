using System;

namespace hunter_warfield.Core.Interfaces
{
    public interface IIdentifier<I>
    {
        I Id { get; set; }
    }
}
