using System;
using UnityEngine;

[Serializable]
public struct SerializableVector2
{
    public static implicit operator SerializableVector2(Vector2 v) => new SerializableVector2() { x = v.x, y = v.y };
    public static implicit operator SerializableVector2(Vector3 v) => new SerializableVector2() { x = v.x, y = v.y };
    public static implicit operator Vector2(SerializableVector2 sv) => new Vector2(sv.x, sv.y);
    public static implicit operator Vector3(SerializableVector2 sv) => new Vector3(sv.x, sv.y, 0);

    public float x;
    public float y;
}
