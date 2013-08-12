using System;

namespace hunter_warfield.Core.Interfaces
{
    public interface IDataTransfer<T>
    {
        T ToEntity();
    }
}
