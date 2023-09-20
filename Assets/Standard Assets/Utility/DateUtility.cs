using System;

public static class DateUtility {
    public static long CurrentEpocTime {
        get {
            TimeSpan t = DateTime.UtcNow - new DateTime(1970, 1, 1);
            return (long)t.TotalMilliseconds;
        }
    }
}
