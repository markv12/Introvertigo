using System;
using System.Collections.Generic;
using System.Linq;

public static class ArrayExtensions
{
    // create a subset from a range of indices
    public static T[] RangeSubset<T>(this T[] array, int startIndex, int length)
    {
        T[] subset = new T[length];
        Array.Copy(array, startIndex, subset, 0, length);
        return subset;
    }

    // create a subset from a specific list of indices
    public static T[] Subset<T>(this T[] array, params int[] indices)
    {
        T[] subset = new T[indices.Length];
        for (int i = 0; i < indices.Length; i++)
        {
            subset[i] = array[indices[i]];
        }
        return subset;
    }

    public static T[] RandomSubset<T>(this List<T> list, int length) {
        if(length > list.Count) { return list.ToArray(); }
        return list.OrderBy(x => UnityEngine.Random.Range(0f, 1f)).Take(length).ToArray();
    }
}